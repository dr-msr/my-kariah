# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
<!-- - New features that have been added since the last release -->
- [21/01] Add header to Go. [GO] 
- [21/01] Add footer to Go. [GO] 
- [21/01] Add Twitter (X) and Facebook link to footer. [GO] 

### Changed
<!-- - Changes to existing functionality -->
- [22/01] Removed Get Zone API call for WaktuSolat module, migrate to local geojson. Module should load 50% faster. [WaktuSolat.module] 
- [22/01] API WaktuSolat no longer requiring cors (thanks iqfareez) [WaktuSolat.module] 
- [22/01] Changed min-width to XL. [GO] 
- [22/01] Redirection of https://solat.today no longer happened at the level of DNS, instead, handled by middleware for a better SEO outcome. [GO] 

### Deprecated
<!-- - Features that are planned to be removed in a future release -->

### Removed
<!-- - Features that have been removed -->

### Fixed
<!-- - Any bug fixes -->
- [21/01] Fix metadata for Go [Go]
- [22/01] Fix metadataBase

### Security
<!-- - Any security fixes -->

## [0.0.1] - 2024-01-19

### Added
- Initial release