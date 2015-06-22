"use strict";
var wf4node = require("../../../");
var InstanceIdParser = wf4node.hosting.InstanceIdParser;
var _ = require("lodash");
var hostingTestCommon = require("./hostingTestCommon");
var MemoryPersistence = wf4node.hosting.MemoryPersistence;
var Serializer = require("backpack-node").system.Serializer;
var assert = require("assert");
describe("InstanceIdParser", function() {
  describe("#parse()", function() {
    it("should understand common paths", function() {
      var p = new InstanceIdParser();
      assert.equal(p.parse("this", 1), 1);
      assert.equal(p.parse("[0]", [1]), 1);
      assert.equal(p.parse("[0]", [4, 5]), 4);
      assert.equal(p.parse("[1].id", [{id: 1}, {id: 2}]), 2);
      assert.equal(p.parse("id[0].a", {id: [{a: "foo"}]}), "foo");
    });
  });
});
describe("WorkflowHost", function() {
  describe("Without persistence", function() {
    it("should run basic hosting example", function(done) {
      hostingTestCommon.doBasicHostTest().nodeify(done);
    });
    it("should run correlated calculator example", function(done) {
      hostingTestCommon.doCalculatorTest().nodeify(done);
    });
  });
  describe("With MemoryPersistence", function() {
    this.timeout(5000);
    it("should run basic hosting example in non-lazy mode", function(done) {
      var hostOptions = {
        persistence: new MemoryPersistence(),
        lazyPersistence: false,
        serializer: null,
        alwaysLoadState: true
      };
      hostingTestCommon.doBasicHostTest(hostOptions).nodeify(done);
    });
    it("should run basic hosting example in lazy mode", function(done) {
      var hostOptions = {
        persistence: new MemoryPersistence(),
        lazyPersistence: true,
        serializer: null,
        alwaysLoadState: true
      };
      hostingTestCommon.doBasicHostTest(hostOptions).nodeify(done);
    });
    it("should run correlated calculator example in non-lazy mode", function(done) {
      var hostOptions = {
        persistence: new MemoryPersistence(),
        lazyPersistence: false,
        serializer: null,
        alwaysLoadState: true
      };
      hostingTestCommon.doCalculatorTest(hostOptions).nodeify(done);
    });
    it("should run correlated calculator example in lazy mode", function(done) {
      var hostOptions = {
        persistence: new MemoryPersistence(),
        lazyPersistence: true,
        serializer: null,
        alwaysLoadState: true
      };
      hostingTestCommon.doCalculatorTest(hostOptions).nodeify(done);
    });
    it("should run correlated calculator example if state is serialized", function(done) {
      var hostOptions = {
        persistence: new MemoryPersistence(),
        lazyPersistence: false,
        serializer: new Serializer(),
        alwaysLoadState: true
      };
      hostingTestCommon.doCalculatorTest(hostOptions).nodeify(done);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,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UUFBQSxDQUFBLFdBQVUsRUFBSTtBQUNkLGtCQUFVLENBQUcsSUFBSSxrQkFBZ0IsQUFBQyxFQUFDO0FBQ25DLHNCQUFjLENBQUcsS0FBRztBQUNwQixpQkFBUyxDQUFHLEtBQUc7QUFDZixzQkFBYyxDQUFHLEtBQUc7QUFBQSxNQUN4QixDQUFDO0FBQ0Qsc0JBQWdCLGlCQUFpQixBQUFDLENBQUMsV0FBVSxDQUFDLFFBQVEsQUFBQyxDQUFDLElBQUcsQ0FBQyxDQUFDO0lBQ2pFLENBQUMsQ0FBQztBQUVGLEtBQUMsQUFBQyxDQUFDLGlFQUFnRSxDQUFHLFVBQVUsSUFBRyxDQUFHO0FBQ2xGLEFBQUksUUFBQSxDQUFBLFdBQVUsRUFBSTtBQUNkLGtCQUFVLENBQUcsSUFBSSxrQkFBZ0IsQUFBQyxFQUFDO0FBQ25DLHNCQUFjLENBQUcsTUFBSTtBQUNyQixpQkFBUyxDQUFHLElBQUksV0FBUyxBQUFDLEVBQUM7QUFDM0Isc0JBQWMsQ0FBRyxLQUFHO0FBQUEsTUFDeEIsQ0FBQztBQUNELHNCQUFnQixpQkFBaUIsQUFBQyxDQUFDLFdBQVUsQ0FBQyxRQUFRLEFBQUMsQ0FBQyxJQUFHLENBQUMsQ0FBQztJQUNqRSxDQUFDLENBQUM7RUFDTixDQUFDLENBQUM7QUFDTixDQUFDLENBQUM7QUFDRiIsImZpbGUiOiJob3N0aW5nL2NvcmVIb3N0aW5nVGVzdHMuanMiLCJzb3VyY2VSb290IjoidGVzdHMvZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIHdmNG5vZGUgPSByZXF1aXJlKFwiLi4vLi4vLi4vXCIpO1xyXG52YXIgSW5zdGFuY2VJZFBhcnNlciA9IHdmNG5vZGUuaG9zdGluZy5JbnN0YW5jZUlkUGFyc2VyO1xyXG52YXIgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XHJcbnZhciBob3N0aW5nVGVzdENvbW1vbiA9IHJlcXVpcmUoXCIuL2hvc3RpbmdUZXN0Q29tbW9uXCIpO1xyXG52YXIgTWVtb3J5UGVyc2lzdGVuY2UgPSB3ZjRub2RlLmhvc3RpbmcuTWVtb3J5UGVyc2lzdGVuY2U7XHJcbnZhciBTZXJpYWxpemVyID0gcmVxdWlyZShcImJhY2twYWNrLW5vZGVcIikuc3lzdGVtLlNlcmlhbGl6ZXI7XHJcblxyXG52YXIgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcclxuXHJcbmRlc2NyaWJlKFwiSW5zdGFuY2VJZFBhcnNlclwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBkZXNjcmliZShcIiNwYXJzZSgpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpdChcInNob3VsZCB1bmRlcnN0YW5kIGNvbW1vbiBwYXRoc1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwID0gbmV3IEluc3RhbmNlSWRQYXJzZXIoKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHAucGFyc2UoXCJ0aGlzXCIsIDEpLCAxKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHAucGFyc2UoXCJbMF1cIiwgWzFdKSwgMSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChwLnBhcnNlKFwiWzBdXCIsIFs0LCA1XSksIDQpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocC5wYXJzZShcIlsxXS5pZFwiLCBbe2lkOiAxfSwge2lkOiAyfV0pLCAyKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHAucGFyc2UoXCJpZFswXS5hXCIsIHtpZDogW3thOiBcImZvb1wifV19KSwgXCJmb29cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG5kZXNjcmliZShcIldvcmtmbG93SG9zdFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBkZXNjcmliZShcIldpdGhvdXQgcGVyc2lzdGVuY2VcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGl0KFwic2hvdWxkIHJ1biBiYXNpYyBob3N0aW5nIGV4YW1wbGVcIiwgZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgaG9zdGluZ1Rlc3RDb21tb24uZG9CYXNpY0hvc3RUZXN0KCkubm9kZWlmeShkb25lKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJzaG91bGQgcnVuIGNvcnJlbGF0ZWQgY2FsY3VsYXRvciBleGFtcGxlXCIsIGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgIGhvc3RpbmdUZXN0Q29tbW9uLmRvQ2FsY3VsYXRvclRlc3QoKS5ub2RlaWZ5KGRvbmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoXCJXaXRoIE1lbW9yeVBlcnNpc3RlbmNlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnRpbWVvdXQoNTAwMCk7XHJcblxyXG4gICAgICAgIGl0KFwic2hvdWxkIHJ1biBiYXNpYyBob3N0aW5nIGV4YW1wbGUgaW4gbm9uLWxhenkgbW9kZVwiLCBmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICB2YXIgaG9zdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBwZXJzaXN0ZW5jZTogbmV3IE1lbW9yeVBlcnNpc3RlbmNlKCksXHJcbiAgICAgICAgICAgICAgICBsYXp5UGVyc2lzdGVuY2U6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2VyaWFsaXplcjogbnVsbCxcclxuICAgICAgICAgICAgICAgIGFsd2F5c0xvYWRTdGF0ZTogdHJ1ZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBob3N0aW5nVGVzdENvbW1vbi5kb0Jhc2ljSG9zdFRlc3QoaG9zdE9wdGlvbnMpLm5vZGVpZnkoZG9uZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGl0KFwic2hvdWxkIHJ1biBiYXNpYyBob3N0aW5nIGV4YW1wbGUgaW4gbGF6eSBtb2RlXCIsIGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgIHZhciBob3N0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHBlcnNpc3RlbmNlOiBuZXcgTWVtb3J5UGVyc2lzdGVuY2UoKSxcclxuICAgICAgICAgICAgICAgIGxhenlQZXJzaXN0ZW5jZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZXI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBhbHdheXNMb2FkU3RhdGU6IHRydWVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaG9zdGluZ1Rlc3RDb21tb24uZG9CYXNpY0hvc3RUZXN0KGhvc3RPcHRpb25zKS5ub2RlaWZ5KGRvbmUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcInNob3VsZCBydW4gY29ycmVsYXRlZCBjYWxjdWxhdG9yIGV4YW1wbGUgaW4gbm9uLWxhenkgbW9kZVwiLCBmdW5jdGlvbiAoZG9uZSkge1xyXG4gICAgICAgICAgICB2YXIgaG9zdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBwZXJzaXN0ZW5jZTogbmV3IE1lbW9yeVBlcnNpc3RlbmNlKCksXHJcbiAgICAgICAgICAgICAgICBsYXp5UGVyc2lzdGVuY2U6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2VyaWFsaXplcjogbnVsbCxcclxuICAgICAgICAgICAgICAgIGFsd2F5c0xvYWRTdGF0ZTogdHJ1ZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBob3N0aW5nVGVzdENvbW1vbi5kb0NhbGN1bGF0b3JUZXN0KGhvc3RPcHRpb25zKS5ub2RlaWZ5KGRvbmUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpdChcInNob3VsZCBydW4gY29ycmVsYXRlZCBjYWxjdWxhdG9yIGV4YW1wbGUgaW4gbGF6eSBtb2RlXCIsIGZ1bmN0aW9uIChkb25lKSB7XHJcbiAgICAgICAgICAgIHZhciBob3N0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHBlcnNpc3RlbmNlOiBuZXcgTWVtb3J5UGVyc2lzdGVuY2UoKSxcclxuICAgICAgICAgICAgICAgIGxhenlQZXJzaXN0ZW5jZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZXI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBhbHdheXNMb2FkU3RhdGU6IHRydWVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaG9zdGluZ1Rlc3RDb21tb24uZG9DYWxjdWxhdG9yVGVzdChob3N0T3B0aW9ucykubm9kZWlmeShkb25lKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaXQoXCJzaG91bGQgcnVuIGNvcnJlbGF0ZWQgY2FsY3VsYXRvciBleGFtcGxlIGlmIHN0YXRlIGlzIHNlcmlhbGl6ZWRcIiwgZnVuY3Rpb24gKGRvbmUpIHtcclxuICAgICAgICAgICAgdmFyIGhvc3RPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgcGVyc2lzdGVuY2U6IG5ldyBNZW1vcnlQZXJzaXN0ZW5jZSgpLFxyXG4gICAgICAgICAgICAgICAgbGF6eVBlcnNpc3RlbmNlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNlcmlhbGl6ZXI6IG5ldyBTZXJpYWxpemVyKCksXHJcbiAgICAgICAgICAgICAgICBhbHdheXNMb2FkU3RhdGU6IHRydWVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaG9zdGluZ1Rlc3RDb21tb24uZG9DYWxjdWxhdG9yVGVzdChob3N0T3B0aW9ucykubm9kZWlmeShkb25lKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl19