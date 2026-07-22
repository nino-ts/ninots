# Changelog

## [0.4.1](https://github.com/nino-ts/ninots/compare/v0.4.0...v0.4.1) (2026-07-22)


### Features

* **cli:** auto-hook routes:compile on serve in development (Fixes [#38](https://github.com/nino-ts/ninots/issues/38)) ([f547eb6](https://github.com/nino-ts/ninots/commit/f547eb6053d1e6d840f7e03f9bc963e9447f158f))
* **cli:** auto-hook routes:compile on serve in development (Fixes [#38](https://github.com/nino-ts/ninots/issues/38)) ([efc7f14](https://github.com/nino-ts/ninots/commit/efc7f147c735abca942be7d1a957e867e01fdaa0))
* **cli:** wire make:* generators and add feature tests ([5ab45f0](https://github.com/nino-ts/ninots/commit/5ab45f03797a3dbffb3b13d78180335c5111a3cf)), closes [#22](https://github.com/nino-ts/ninots/issues/22) [#23](https://github.com/nino-ts/ninots/issues/23)
* **cli:** wire migrate:rollback + migrate:refresh (Sprint 7) ([0bb3515](https://github.com/nino-ts/ninots/commit/0bb35150f7f20966c9df2f2ab0624119bc2d493b))
* **cli:** wire migrate:rollback and migrate:refresh ([aabe0c6](https://github.com/nino-ts/ninots/commit/aabe0c6f44843f7f82bd904f49f12eca9eff1ca6))
* **cli:** wire nino make:module (Sprint 8) ([3a58ea3](https://github.com/nino-ts/ninots/commit/3a58ea3cbbf377b3e9d01a289d751d3c7c50c7b4))
* **cli:** wire nino make:module + feature tests (Fixes [#30](https://github.com/nino-ts/ninots/issues/30), Fixes [#31](https://github.com/nino-ts/ninots/issues/31)) ([67d9477](https://github.com/nino-ts/ninots/commit/67d9477bb0d76d6a163fc89d1ab7d9f9945cf6d9))
* **docker:** starter Dockerfile + compose SQLite (Fixes [#36](https://github.com/nino-ts/ninots/issues/36)) ([545b51c](https://github.com/nino-ts/ninots/commit/545b51c9d92e2ac53478d5c6da66ff4312033f52))
* enhance route discovery and listing in CLI commands ([82edc37](https://github.com/nino-ts/ninots/commit/82edc37c9baaf78005b60e02f7bd67e2be10a094))
* flatten layout to Laravel root and wire UserCreatedEvent (Fixes [#5](https://github.com/nino-ts/ninots/issues/5), Fixes [#6](https://github.com/nino-ts/ninots/issues/6), Fixes [#7](https://github.com/nino-ts/ninots/issues/7), Fixes [#8](https://github.com/nino-ts/ninots/issues/8)) ([3cd1bf5](https://github.com/nino-ts/ninots/commit/3cd1bf5b28fa330a7bc2de45a73d682a011f3fcb))
* **http:** wire wideEventMiddleware + smoke assert one canonical line (Fixes [#33](https://github.com/nino-ts/ninots/issues/33)) ([fb778d0](https://github.com/nino-ts/ninots/commit/fb778d0dfc11c5f1a914a681f3f2ab63707cf087))
* **routes:** typed route registry starter wire (Fixes [#35](https://github.com/nino-ts/ninots/issues/35)) ([8780bc2](https://github.com/nino-ts/ninots/commit/8780bc2c20baa7bee7b5b3e432a217142a9b15cc))
* **routes:** typed route registry starter wire (Sprint 10) ([73463a5](https://github.com/nino-ts/ninots/commit/73463a5b8e5830ea2630dc8f5d77c9e76d522edc))
* **sprint-11:** .github mirror + Docker starter (Fixes [#36](https://github.com/nino-ts/ninots/issues/36)) ([d98f289](https://github.com/nino-ts/ninots/commit/d98f289feea1ac28d85752a83b03b090dcf687bb))
* **web:** contact POST demo with CSRF feature tests (Fixes [#16](https://github.com/nino-ts/ninots/issues/16)) ([c25db9d](https://github.com/nino-ts/ninots/commit/c25db9d5f5a64846910ca13002b5795877d22913))
* **web:** wire resources/views welcome page with @ninots/view (Fixes [#13](https://github.com/nino-ts/ninots/issues/13), Fixes [#14](https://github.com/nino-ts/ninots/issues/14)) ([551d130](https://github.com/nino-ts/ninots/commit/551d130c6a50c207aa077d023ffd4a95466785ae))
* **web:** wire welcome view via @ninots/view (Sprint 4) ([f4e01b4](https://github.com/nino-ts/ninots/commit/f4e01b4459f333f5418b0f3863524b47cb73d4d5))
* wire factories, seeders, migrate CLI, and factory tests (Fixes [#10](https://github.com/nino-ts/ninots/issues/10), Fixes [#11](https://github.com/nino-ts/ninots/issues/11)) ([d5cc4ab](https://github.com/nino-ts/ninots/commit/d5cc4abe4614aac12db87b92b68a259ecfd72aae))


### Bug Fixes

* **ci:** commitlint config + link workspace packages for tsc ([169767b](https://github.com/nino-ts/ninots/commit/169767bb9eebb1412394ab01f2f36f356d63230f))
* **ci:** keep routes.d.ts compile-shaped; exclude from Biome ([ef954e5](https://github.com/nino-ts/ninots/commit/ef954e5a2f97e74d89a6fb9cb48bb7024c966bab))
* CLI entry nino wrapper + bootstrap/cli.ts (Fixes [#21](https://github.com/nino-ts/ninots/issues/21)) ([c85bd2e](https://github.com/nino-ts/ninots/commit/c85bd2eeedd99f87600d838eaafcdf86819e6ebc))
* CLI entry nino wrapper + bootstrap/cli.ts (Fixes [#21](https://github.com/nino-ts/ninots/issues/21)) ([f058cf8](https://github.com/nino-ts/ninots/commit/f058cf8cbab94230e03cc323d8247e91ca971761))
* **cli:** isolate bootstrap in routes auto-hook (Fixes [#45](https://github.com/nino-ts/ninots/issues/45)) ([ab9eaa6](https://github.com/nino-ts/ninots/commit/ab9eaa6b62ff50e36d4ec9ff02752e0006317409))
* **cli:** isolate bootstrap in routes auto-hook (Fixes [#45](https://github.com/nino-ts/ninots/issues/45)) ([437bdaf](https://github.com/nino-ts/ninots/commit/437bdaf084aba1e686159b98e485ca0c0224cca8))
* correct package.json import path in nino CLI (Fixes [#3](https://github.com/nino-ts/ninots/issues/3)) ([e244999](https://github.com/nino-ts/ninots/commit/e24499943b31644a5a2b042dd0fb233be02eb6f9))
* resolve merge conflicts with main for Sprint 1 (Fixes [#4](https://github.com/nino-ts/ninots/issues/4)) ([10e4142](https://github.com/nino-ts/ninots/commit/10e414275d902fed4c355b88103e0f7ac99a15ec))
* **routes:** move generator import markers to top-level ([808c7ba](https://github.com/nino-ts/ninots/commit/808c7ba8c1016f1cdf5ab4f2cde78b04831704b2))
* **routes:** top-level generator import markers (framework[#42](https://github.com/nino-ts/ninots/issues/42)) ([b359bf4](https://github.com/nino-ts/ninots/commit/b359bf4f8ee0491dec14458124365f3e0afcaf8f))
* same-repo CI gate + Bun-only + Biome 2.5.4 (Fixes [#40](https://github.com/nino-ts/ninots/issues/40)) ([0685f1b](https://github.com/nino-ts/ninots/commit/0685f1b7128b576b12b1443c7bb4995067278021))
* **ts:** green type-check with linked framework (Fixes [#19](https://github.com/nino-ts/ninots/issues/19)) ([8e3ce00](https://github.com/nino-ts/ninots/commit/8e3ce00c9bc6ee31962e45e8645dc0a8584ff27a))
* **ts:** make bun run type-check green with linked framework (Fixes [#19](https://github.com/nino-ts/ninots/issues/19)) ([96912fb](https://github.com/nino-ts/ninots/commit/96912fbd88d5a086b652963dbe7c4b7cfb3cbfe7))
