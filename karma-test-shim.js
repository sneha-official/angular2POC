Error.stackTraceLimit = 0;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// (1)
var builtPaths = (__karma__.config.builtPaths || ['dist/'])  //changed 'app' to 'dist' here as my all js files are placed under dist folder afer compilation
                  .map(function(p) { return '/base/'+p;});

// (2)
__karma__.loaded = function () { };

// (3)
function isJsFile(path) {
  return path.slice(-3) == '.js';
}

// (4)
function isSpecFile(path) {
  return /\.spec\.(.*\.)?js$/.test(path);
}

// (5)
function isBuiltFile(path) {
  return isJsFile(path) &&
          builtPaths.reduce(function(keep, bp) {
            return keep || (path.substr(0, bp.length) === bp);
          }, false);
}

// (6)
var allSpecFiles = Object.keys(window.__karma__.files)
  .filter(isSpecFile)
  .filter(isBuiltFile);

// (7)
SystemJS.config({
  baseURL: 'base',
    
  // Assume npm: is set in `paths` in systemjs.config
  // Map the angular testing umd bundles
  map: {
    '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
    '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
    '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
    '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
    '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
    '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
    '@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js',
  },
});

// (8)
System.import('systemjs.config.js')
  .then(initTestBed) //10
  .then(initTesting);


// (9)
function initTesting () {
  return Promise.all(
    allSpecFiles.map(function (moduleName) {
      return System.import(moduleName);
    })
  )
  .then(__karma__.start, __karma__.error);
}

//10
function initTestBed(){
  return Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing')
  ])
 
  .then(function (providers) {
    var coreTesting    = providers[0];
    var browserTesting = providers[1];
 
    coreTesting.TestBed.initTestEnvironment(
      browserTesting.BrowserDynamicTestingModule,
      browserTesting.platformBrowserDynamicTesting());
  })
}