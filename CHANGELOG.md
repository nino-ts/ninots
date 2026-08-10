# Changelog

## [0.7.0](https://github.com/nino-ts/ninots/compare/v0.6.0...v0.7.0) (2026-08-10)


### Features

* wire @ninots/cache Redis store (Fixes [#74](https://github.com/nino-ts/ninots/issues/74)) ([89861c8](https://github.com/nino-ts/ninots/commit/89861c8cd663754a2ba9af0142c320fb60aa392a))
* wire @ninots/cache Redis store (Sprint 24) ([d528720](https://github.com/nino-ts/ninots/commit/d52872095242736ddadabd41236833cd092759ad))

## [0.6.0](https://github.com/nino-ts/ninots/compare/v0.5.0...v0.6.0) (2026-08-09)


### Features

* wire @ninots/notifications (Sprint 23) ([3ea45a0](https://github.com/nino-ts/ninots/commit/3ea45a001b5234c7f9924695ccfd272fdf6baf47))
* wire @ninots/notifications starter (Fixes [#71](https://github.com/nino-ts/ninots/issues/71)) ([3a1281b](https://github.com/nino-ts/ninots/commit/3a1281b994b42736ad2b32ce36c494837071e99d))


### Bug Fixes

* resolve NotificationSender from MailManager ([04eac27](https://github.com/nino-ts/ninots/commit/04eac277d58c0bd03b4b307ed677586eb1a26c46))

## [0.5.0](https://github.com/nino-ts/ninots/compare/v0.4.1...v0.5.0) (2026-08-09)


### Features

* **mail:** wire @ninots/mail starter (Fixes [#64](https://github.com/nino-ts/ninots/issues/64)) ([9b154f4](https://github.com/nino-ts/ninots/commit/9b154f4710701ff9e28f9aef3f24eda5aa61b4c7))
* **mail:** wire @ninots/mail@0.1.0 (S21) ([30e5387](https://github.com/nino-ts/ninots/commit/30e53871d5d11c6d243fe7e01a3bc68b37f078ca))
* **serve:** Bun fullstack HMR demo at /hmr-demo (Fixes [#49](https://github.com/nino-ts/ninots/issues/49)) ([4309a95](https://github.com/nino-ts/ninots/commit/4309a95d348ad33dce10931831805718550cc065))
* **serve:** Bun fullstack HMR demo at /hmr-demo (Sprint 13) ([a26ea08](https://github.com/nino-ts/ninots/commit/a26ea088144dd358a334189cd477a4090716678e))
* session-auth adapter + bump 0.2.0 (Fixes [#56](https://github.com/nino-ts/ninots/issues/56)) ([11e5181](https://github.com/nino-ts/ninots/commit/11e5181f5bebdb39b3461284ac611263356da5be))
* session↔auth adapter + bump ^0.2.0 (Fixes [#56](https://github.com/nino-ts/ninots/issues/56)) ([e51d3ff](https://github.com/nino-ts/ninots/commit/e51d3ffcfedeef66bffa86186087b597e7f3acae))
* **sprint-18:** wire social-auth + auth@0.3.0 ([c3f481f](https://github.com/nino-ts/ninots/commit/c3f481f53b74299a56c352eb4762bd326b605979))
* TS7 + @ninots/*@^0.1.0 (Sprint 15) ([35f6dfc](https://github.com/nino-ts/ninots/commit/35f6dfc4b03bb5ec85d16ccf8d5e3f45bad694ba))
* TS7 + @ninots/*@^0.1.0 starter sync (Sprint 15) ([82240b0](https://github.com/nino-ts/ninots/commit/82240b07fc9875e5cbaf196031e8627296c579e7))
* wire redis session + @ninots/queue (Fixes [#61](https://github.com/nino-ts/ninots/issues/61)) ([0effb34](https://github.com/nino-ts/ninots/commit/0effb34be8f7d7c2d9ca06e4a9ded33e76d88630))
* wire redis session + queue (Fixes [#61](https://github.com/nino-ts/ninots/issues/61)) ([8b2a206](https://github.com/nino-ts/ninots/commit/8b2a2066ee796b0799b8754da3ab99e28847ced0))
* wire social-auth + bump auth 0.3.0 (Fixes [#59](https://github.com/nino-ts/ninots/issues/59)) ([56141dd](https://github.com/nino-ts/ninots/commit/56141ddc1725cf3925d40331d7b2b0426cc4d7fd))


### Bug Fixes

* **ci:** biome format after main merge ([22ba794](https://github.com/nino-ts/ninots/commit/22ba7947c8df610fc035de279c780cca642fc3a6))
* **cli:** help/list stdout para spawnSync (Fixes [#66](https://github.com/nino-ts/ninots/issues/66)) ([91c2ee7](https://github.com/nino-ts/ninots/commit/91c2ee782293043cf7d63a677f9983f6a45b379a))
* **cli:** spawn routes:compile in serve auto-hook (Fixes [#47](https://github.com/nino-ts/ninots/issues/47)) ([1e2b905](https://github.com/nino-ts/ninots/commit/1e2b905380fd05bcd18897d2d7bbf2f602e57643))
* **cli:** spawn routes:compile in serve auto-hook (Fixes [#47](https://github.com/nino-ts/ninots/issues/47)) ([3647f13](https://github.com/nino-ts/ninots/commit/3647f130b3a11e096a3e15084e5355107568cc0a))
* **cli:** write help/list to stdout ([e63f96b](https://github.com/nino-ts/ninots/commit/e63f96b89a307e48d71e2d11217f2dcb8a523c92))
* **deps:** sync bun.lock to @ninots/framework@0.12.1 ([0a764b1](https://github.com/nino-ts/ninots/commit/0a764b10ef62530402fd9cb8ea92f9e9bd11f14f))
* refresh bun.lock for social-auth + auth@0.3.0 (Fixes [#59](https://github.com/nino-ts/ninots/issues/59)) ([eac5af9](https://github.com/nino-ts/ninots/commit/eac5af948e2d287accae26f3d73b503516264870))
* strip UTF-8 BOM from package.json ([02ffa6c](https://github.com/nino-ts/ninots/commit/02ffa6c0624b4da1e10e7ce728475e378c387ef1))
* strip UTF-8 BOM from package.json ([dc19a1a](https://github.com/nino-ts/ninots/commit/dc19a1acec29a239527040e9c13625910ef9cc1b))
* **ts:** drop baseUrl removed in TypeScript 7 ([8eabe7d](https://github.com/nino-ts/ninots/commit/8eabe7d36cc6471fb794b8f6b0e56bccea921f23))
* TypedRoutes idempotent assert without git diff ([558eaa1](https://github.com/nino-ts/ninots/commit/558eaa1a66aa15b5b385b1226236818b96cb35fe))


### Miscellaneous Chores

* prefer minor bumps pre-1.0 ([8101695](https://github.com/nino-ts/ninots/commit/8101695ab663d3d6533a09b94b3855a24849dc8a))

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
