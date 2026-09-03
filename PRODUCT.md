# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Inferred from the repository and current request: students and friends using a lightweight browser-based hub for games, small utilities, media, and general web access.

## Product Purpose

Nexus gathers a broad game library and a small set of useful browser tools into one fast, searchable site. Success means visitors can find an activity quickly, launch it reliably, and recover clearly when an embedded game or remote site cannot load.

## Positioning

Nexus combines a locally hosted game catalog with a tabbed browser surface and personal appearance controls in a single static deployment.

## Operating Context

Inferred: primarily keyboard-and-mouse school or home computers, with mobile use also expected. The site is hosted as static files on GitHub Pages and some games depend on large local assets or third-party network services.

## Capabilities and Constraints

- Preserve the static HTML, CSS, and JavaScript architecture and GitHub Pages deployment.
- Preserve existing game files and the user's current uncommitted additions.
- Game records require a title, a working launch target, and resilient artwork.
- Remote proxy transport must fail visibly and safely; it must not permit local, loopback, private-network, or non-HTTP destinations.
- New bundled games must be original, permissively licensed, or public-domain-safe rather than copied commercial ROMs.
- Inferred facts above remain open to correction by the user.

## Brand Commitments

Preserve the Nexus name, dark customizable environment, and compact floating navigation.

## Evidence on Hand

- Existing interface and navigation in `index.html` and `storage/css/`.
- Game catalog in `storage/json/games.json` with local launch targets under `pages/games/` and `pages/roms/`.
- Existing proxy browser under `scramjet/`.
- No verified testimonials, usage claims, or public performance benchmarks are available and none should be fabricated.

## Product Principles

- A launch action must always produce a game, a loading state, or a useful recovery message.
- The library should be searchable and recognizable without hover-only information.
- Local content should remain useful even when third-party services fail.
- Dense catalogs must still be comfortable on touch screens and keyboard accessible.

## Accessibility & Inclusion

Target WCAG 2.2 AA for the surrounding Nexus interface, including visible focus, text alternatives, reduced motion, and 44-pixel touch targets.
