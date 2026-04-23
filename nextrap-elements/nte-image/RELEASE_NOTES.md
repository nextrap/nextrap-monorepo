# Release Notes

All notable changes to the Nextrap Element Image project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.3] - 2025-09-05 - Bug Fixes

### Changed

- Closing fullscreen image is now possible when clicking outside of the image as well

## [1.2.2] - 2025-08-25 - Multiple Instance Support & Conflict Resolution

### Testing Infrastructure

This release includes a comprehensive testing suite to validate multiple instance functionality:

#### **Test Dashboard** (`test-dashboard.html`)

- Central navigation hub for all test scenarios
- Professional UI with test categorization
- Quick access to critical test cases
- System status monitoring

#### **Multiple Instance Test** (`test-multiple-instances.html`)

- Basic functionality verification
- 4 different instance configurations
- Interactive testing controls
- Real-time console output

#### **Fullscreen Isolation Test** (`test-fullscreen-isolation.html`)

- Multiple fullscreen views coexistence
- Instance-specific fullscreen elements
- Navigation testing in fullscreen mode
- Stress testing with multiple open views

#### **Slideshow Independence Test** (`test-slideshow-independence.html`)

- Multiple slideshows at different intervals
- Independent timer management
- Navigation control testing
- Performance metrics monitoring

#### **Performance & Memory Test** (`test-performance.html`)

- Real-time performance monitoring
- Dynamic instance creation/destruction
- Memory usage tracking
- Stress testing with up to 20 instances
- Memory leak detection
- Performance data export

#### **Development Integration**

- Automatic dashboard opening with `npm run dev`
- Vite server configuration for testing
- Hot reload support for test files
- Professional testing environment

### Fixed

- **Critical**: Fixed conflicts when rendering multiple instances of the component on the same page
    - Added unique instance ID generation for each component instance
    - Made slideshow style IDs unique per instance to prevent style conflicts
    - Scoped fullscreen element queries to instance-specific selectors
    - Updated fullscreen creation utility to support instance-specific elements
    - Added instance ID attributes to all fullscreen DOM elements for proper isolation

### Changed

- Modified `createFullsizeView` utility function to accept optional `instanceId` parameter
- Updated fullscreen element cleanup to be instance-aware
- Enhanced DOM query selectors to use instance-specific attributes
- Improved fullscreen navigation button handling for multiple instances

### Added

- **Comprehensive Testing Infrastructure**: Complete testing suite for multiple instance functionality
    - **Test Dashboard** (`test-dashboard.html`) - Central navigation hub with test overview
    - **Multiple Instance Test** (`test-multiple-instances.html`) - Basic functionality verification
    - **Fullscreen Isolation Test** (`test-fullscreen-isolation.html`) - Fullscreen conflict testing
    - **Slideshow Independence Test** (`test-slideshow-independence.html`) - Slideshow conflict testing
    - **Performance & Memory Test** (`test-performance.html`) - Performance monitoring and stress testing

### Technical Details

- Each component instance now generates a unique ID using `nte-image-{random}` format
- Fullscreen elements are now scoped with `data-instance` attributes
- Slideshow styles use instance-specific IDs to prevent conflicts
- All DOM queries for fullscreen elements now include instance filtering
- **Testing Infrastructure**: Professional-grade testing suite with real-time monitoring
- **Vite Integration**: Automatic dashboard opening when running `npm run dev`
- **Performance Metrics**: Real-time monitoring of memory usage, FPS, DOM nodes, and event listeners
- **Stress Testing**: Dynamic instance creation/destruction for performance validation
- **Memory Leak Detection**: Automated detection of potential memory issues
- **Console Integration**: Comprehensive logging and debugging support across all test scenarios

### Testing Workflow

The testing suite provides a structured approach to validating multiple instance functionality:

#### **Quick Start**

1. Run `npm run dev` to start the development server
2. Test dashboard automatically opens in browser
3. Navigate between different test scenarios
4. Monitor real-time performance metrics

#### **Test Scenarios**

- **Basic Functionality**: Verify multiple instances load without conflicts
- **Fullscreen Isolation**: Test multiple fullscreen views coexisting
- **Slideshow Independence**: Verify slideshows run at different speeds
- **Performance Under Load**: Monitor behavior with 20+ instances
- **Memory Management**: Detect potential memory leaks

#### **Expected Results**

- ✅ All instances load independently
- ✅ No style conflicts between instances
- ✅ Fullscreen views are completely isolated
- ✅ Slideshows run at different intervals
- ✅ Performance remains stable under load
- ✅ No memory leaks or resource conflicts

### Testing Infrastructure Technical Details

#### **Architecture**

- **Modular Design**: Each test file focuses on specific functionality
- **Consistent Navigation**: Unified navigation system across all tests
- **Responsive UI**: Mobile-friendly testing interface
- **Real-time Monitoring**: Live performance metrics and console output

#### **Performance Monitoring**

- **Memory Usage**: Simulated memory consumption tracking
- **FPS Monitoring**: Frame rate performance measurement
- **DOM Node Count**: Total DOM element tracking
- **Event Listener Count**: Active event handler monitoring
- **Interval Tracking**: Running slideshow timer count

#### **Stress Testing Capabilities**

- **Dynamic Instance Creation**: Programmatic instance generation
- **Load Testing**: Up to 20 simultaneous instances
- **Memory Leak Detection**: Automated resource monitoring
- **Performance Regression**: Baseline performance comparison
- **Data Export**: JSON export of performance metrics

#### **Development Experience**

- **Hot Reload**: Instant test file updates
- **Console Integration**: Captured console output display
- **Error Reporting**: Visual error and success indicators
- **Test Results**: Persistent test result logging
- **Navigation**: Easy switching between test scenarios

## [1.2.1] - 2025-07-12 - Bug Fixes & Reliability Improvements

### Changed

- Fixed minor bugs and improved overall reliability
- Enhanced event handling system for better performance
- Updated documentation for event callbacks and usage examples
- Relocated test image asset for improved Storybook integration
- Extend with "debug" attribute to enable debug mode for development purposes

## [1.2.0] - 2023-11-20 - Enhanced Mobile Experience & Fullscreen Navigation

### Added

- Improved fullscreen mode with navigation controls:
    - Next/previous buttons for slideshow navigation in fullscreen view
    - Keyboard arrow key support for navigating between slides
    - Swipe gesture support for mobile devices in fullscreen mode
- Enhanced touch interaction system:
    - Improved swipe detection with velocity and distance thresholds
    - Better touch event handling with passive event listeners
    - Smoother animations and transitions for touch interactions

### Changed

- Redesigned fullscreen UI with improved styling:
    - Better positioning and sizing of navigation controls
    - Enhanced close button with improved visibility
    - Responsive design adjustments for different screen sizes
- Optimized touch event handling for better performance
- Improved mobile detection and responsiveness

## [1.1.0] - 2023-11-15 - Event Callbacks

### Added

- Six new event callbacks for enhanced component integration:
    - `onSlideChange`: Triggered when the active slide changes
    - `onFullscreenEnter`: Triggered when entering fullscreen mode
    - `onFullscreenExit`: Triggered when exiting fullscreen mode
    - `onSlideshowPause`: Triggered when the slideshow is paused
    - `onSlideshowResume`: Triggered when the slideshow is resumed
    - `onImageClick`: Triggered when an image is clicked
- Comprehensive documentation and examples for all event callbacks
- Automatic slideshow pause when fullsize image is shown

### Changed

- Updated README.md with new event callbacks documentation and usage examples
- Improved Storybook stories to demonstrate event callback functionality
- Relocated test image asset from src/image/ to .storybook/static/ directory
- Enhanced event handling system for better performance and reliability

## [1.0.0] - 2025-04-14 - Initial release

### Added

- Initial release of the Nextrap Element Image component
- Core image component with flexible positioning capabilities
- Slideshow functionality with navigation controls
- Fullsize image viewing with modal support and blurred background
- Virtual image cropping with percentage-based dimensions
- Touch support with swipe detection
- Responsive aspect ratio handling
- Caption support via alt text and data-caption attributes
- Rounded border support
- Pause-on-hover functionality for slideshows
- Custom event system for fullsize view and slide changes
- CSS custom properties for styling customization
- Comprehensive slot system for image management

### Features

- Image positioning control (top, bottom, left, right, center)
- Slideshow navigation (left/right) with indicators
- Fullscreen modal view with blurred background
- Virtual image cropping with percentage-based dimensions
- Mobile-friendly swipe detection
- Responsive design support
- Rounded border customization
- Slideshow pause-on-hover functionality
- Custom event system for integration
- CSS custom properties for styling

### Technical Details

- Web Components based implementation using Lit
- TypeScript support
- Modular architecture with separate utility functions
- Comprehensive test coverage
- Documentation and type definitions
- Custom event system for component interaction
- CSS custom properties for styling flexibility

## Version Categories

### Major Version (X.0.0)

- Breaking changes that require user action
- Major feature additions
- Significant architectural changes

### Minor Version (0.X.0)

- New features in a backward-compatible manner
- Enhancements to existing features
- New utility functions or helpers

### Patch Version (0.0.X)

- Bug fixes
- Performance improvements
- Documentation updates
- Minor improvements to existing features

## Template for New Versions

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added

- New features or capabilities
- New components or utilities
- New documentation

### Changed

- Changes in existing functionality
- Updates to existing features
- Performance improvements

### Deprecated

- Soon-to-be removed features
- Features that will be changed in future versions

### Removed

- Removed features
- Removed dependencies
- Cleanup of deprecated features

### Fixed

- Bug fixes
- Security patches
- Performance issues

### Security

- Security-related changes
- Vulnerability fixes
- Security improvements
```
