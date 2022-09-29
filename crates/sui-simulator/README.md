
# Sui Simulation Testing

This document outlines what the simulator used by `cargo simtest` enables, how it works, how to write sim tests,
and outlines some future work.

## What its for:

Currently, the simulator:

- Provides deterministic, randomized execution of an entire Sui network in a single process.
- Simulates network latency and packet loss as desired.

This allows us to:

- Run tests under adverse network conditions, including high latency, packet loss, and total partitions.
- Run many iterations of tests with different starting seeds, to attempt to expose rare bugs.
- Reproduce bugs easily, once found, by re-running the test with a given seed.

## How it works:

The code for the simulator itself lives in the https://github.com/MystenLabs/mysten-sim repository.
It has the following main components:

1. A [runtime](https://github.com/MystenLabs/mysten-sim/blob/main/msim/src/sim/runtime/mod.rs) which provides:
    - A "node" context for all running tasks. The node is a simulated machine, which can be killed, restarted, or paused.
    - A randomized but deterministic executor.
    - Simulated clock facilities, including timers, sleep(), etc.
    - A global, seeded PRNG used to provide all random behavior throughout the simulator.

1. A network simulator, which delivers network messages between nodes, and can inject latency and packet loss.

1. An API-compatible replacement for tokio.
    - Most facilities from `tokio::runtime` and `tokio::time` are delegated back to the simulator runtime.
    - Custom implementations of the `tokio::net::Tcp*` structs are provided to interface with the network simulator.
    - Most other pieces of tokio (e.g. `sync`) did not need to be re-implemented because they don't interface with the runtime or the network. These are simply re-exported as is.
    - A minimal [fork of tokio](https://github.com/mystenmark/tokio-madsim-fork) is required in order to expose certain internals to the simulator. This fork has very few modifications, which were written to be easily rebaseable when new tokio releases come out.

1. A library of interceptor functions which intercept various posix API calls in order to enforce determinism throughout the test. These include:
    - `getrandom()`, `getentropy()` - intercepted and delegated to the simulator PRNG.
    - Various [socket api calls](https://github.com/MystenLabs/mysten-sim/blob/main/msim/src/sim/net/mod.rs#L195), which intercept networking operations and route them through the network simulator. It was necessary to do this at a very low level because [Quinn](https://github.com/quinn-rs/quinn) does its UDP I/O via direct `libc::` calls rather than using `tokio::net::UdpSocket`.
    - `mach_absolute_time()`, `clock_gettime()`: Intercepted to provide deterministic high-resolution timing behavior.
    - TODO: `gettimeofday()`: We would like to intercept this to provide deterministic wall-clock operations (e.g. on dates, etc). However, intercepting this currently breaks RocksDB.

    This interception behavior is in effect only in threads that have explicity enabled it, which generally includes the main test thread only. In other threads, the interceptors delegate the call to the system library implementation via `dlsym()`. See implementation [here](https://github.com/MystenLabs/mysten-sim/blob/main/msim/src/sim/intercept.rs#L34-L48).

1. Procedural macros that replace `#[tokio::test]` and run test code inside a testing environment.

## How to write Simtests

TODO

### Configuring the network:

Network latency and packet loss can be configured using [SimConfig](https://github.com/MystenLabs/mysten-sim/blob/main/msim/src/sim/config.rs#L8), which is re-exported from this crate as `sui_simulator::config::SimConfig`.

To configure a test, you write:

      fn my_config() -> SimConfig {
         ...
      }

      #[sim_test(config = my_config())]

A vector a SimConfigs can also be returned to run the same test under multiple configurations.
