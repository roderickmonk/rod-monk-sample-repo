/*
 angular-file-upload v2.1.4
*/

! function (e, t) {
	"object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : "object" == typeof exports ? exports["angular-file-upload"] = t() : e["angular-file-upload"] = t()
}(this, function () {
	return function (e) {
		function t(r) {
			if (n[r]) return n[r].exports;
			var i = n[r] = {
				exports: {},
				id: r,
				loaded: !1
			};
			return e[r].call(i.exports, i, i.exports, t), i.loaded = !0, i.exports
		}
		var n = {};
		return t.m = e, t.c = n, t.p = "", t(0)
	}([function (e, t, n) {
		"use strict";
		var r = function (e) {
				return e && e.__esModule ? e["default"] : e
			},
			i = r(n(2)),
			o = r(n(3)),
			s = r(n(4)),
			a = r(n(5)),
			u = r(n(6)),
			l = r(n(7)),
			c = r(n(1)),
			f = r(n(8)),
			p = r(n(9)),
			d = r(n(10)),
			v = r(n(11)),
			h = r(n(12));
		angular.module(i.name, []).value("fileUploaderOptions", o).factory("FileUploader", s).factory("FileLikeObject", a).factory("FileItem", u).factory("FileDirective", l).factory("FileSelect", c).factory("FileDrop", f).factory("FileOver", p).directive("nvFileSelect", d).directive("nvFileDrop", v).directive("nvFileOver", h).run(["FileUploader", "FileLikeObject", "FileItem", "FileDirective", "FileSelect", "FileDrop", "FileOver", function (e, t, n, r, i, o, s) {
			e.FileLikeObject = t, e.FileItem = n, e.FileDirective = r, e.FileSelect = i, e.FileDrop = o, e.FileOver = s
		}])
	}, function (e, t, n) {
		"use strict";
		var r = function (e) {
				return e && e.__esModule ? e["default"] : e
			},
			i = function () {
				function e(e, t) {
					for (var n in t) {
						var r = t[n];
						r.configurable = !0, r.value && (r.writable = !0)
					}
					Object.defineProperties(e, t)
				}
				return function (t, n, r) {
					return n && e(t.prototype, n), r && e(t, r), t
				}
			}(),
			o = function l(e, t, n) {
				var r = Object.getOwnPropertyDescriptor(e, t);
				if (void 0 === r) {
					var i = Object.getPrototypeOf(e);
					return null === i ? void 0 : l(i, t, n)
				}
				if ("value" in r && r.writable) return r.value;
				var o = r.get;
				return void 0 === o ? void 0 : o.call(n)
			},
			s = function (e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (e.__proto__ = t)
			},
			a = function (e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			},
			u = (r(n(2)), angular.extend);
		e.exports = function (e) {
			var t = function (e) {
				function t(e) {
					a(this, t);
					var n = u(e, {
						events: {
							$destroy: "destroy",
							change: "onChange"
						},
						prop: "select"
					});
					o(Object.getPrototypeOf(t.prototype), "constructor", this).call(this, n), this.uploader.isHTML5 || this.element.removeAttr("multiple"), this.element.prop("value", null)
				}
				return s(t, e), i(t, {
					getOptions: {
						value: function () {}
					},
					getFilters: {
						value: function () {}
					},
					isEmptyAfterSelection: {
						value: function () {
							return !!this.element.attr("multiple")
						}
					},
					onChange: {
						value: function () {
							var e = this.uploader.isHTML5 ? this.element[0].files : this.element[0],
								t = this.getOptions(),
								n = this.getFilters();
							this.uploader.isHTML5 || this.destroy(), this.uploader.addToQueue(e, t, n), this.isEmptyAfterSelection() && (this.element.prop("value", null), this.element.replaceWith(this.element = this.element.clone(!0)))
						}
					}
				}), t
			}(e);
			return t
		}, e.exports.$inject = ["FileDirective"]
	}, function (e, t) {
		e.exports = {
			name: "angularFileUpload"
		}
	}, function (e, t) {
		"use strict";
		e.exports = {
			url: "/",
			alias: "file",
			headers: {},
			queue: [],
			progress: 0,
			autoUpload: !1,
			removeAfterUpload: !1,
			method: "POST",
			filters: [],
			formData: [],
			queueLimit: Number.MAX_VALUE,
			withCredentials: !1
		}
	}, function (e, t, n) {
		"use strict";
		var r = function (e) {
				return e && e.__esModule ? e["default"] : e
			},
			i = function () {
				function e(e, t) {
					for (var n in t) {
						var r = t[n];
						r.configurable = !0, r.value && (r.writable = !0)
					}
					Object.defineProperties(e, t)
				}
				return function (t, n, r) {
					return n && e(t.prototype, n), r && e(t, r), t
				}
			}(),
			o = function (e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			},
			s = (r(n(2)), angular.copy),
			a = angular.extend,
			u = angular.forEach,
			l = angular.isObject,
			c = angular.isNumber,
			f = angular.isDefined,
			p = angular.isArray,
			d = angular.element;
		e.exports = function (e, t, n, r, v, h) {
			var m = r.File,
				g = r.FormData,
				_ = function () {
					function r(t) {
						o(this, r);
						var n = s(e);
						a(this, n, t, {
							isUploading: !1,
							_nextIndex: 0,
							_failFilterIndex: -1,
							_directives: {
								select: [],
								drop: [],
								over: []
							}
						}), this.filters.unshift({
							name: "queueLimit",
							fn: this._queueLimitFilter
						}), this.filters.unshift({
							name: "folder",
							fn: this._folderFilter
						})
					}
					return i(r, {
						addToQueue: {
							value: function (e, t, n) {
								var r = this,
									i = this.isArrayLikeObject(e) ? e : [e],
									o = this._getFilters(n),
									s = this.queue.length,
									a = [];
								u(i, function (e) {
									var n = new v(e);
									if (r._isValidFile(n, o, t)) {
										var i = new h(r, e, t);
										a.push(i), r.queue.push(i), r._onAfterAddingFile(i)
									} else {
										var s = o[r._failFilterIndex];
										r._onWhenAddingFileFailed(n, s, t)
									}
								}), this.queue.length !== s && (this._onAfterAddingAll(a), this.progress = this._getTotalProgress()), this._render(), this.autoUpload && this.uploadAll()
							}
						},
						removeFromQueue: {
							value: function (e) {
								var t = this.getIndexOfItem(e),
									n = this.queue[t];
								n.isUploading && n.cancel(), this.queue.splice(t, 1), n._destroy(), this.progress = this._getTotalProgress()
							}
						},
						clearQueue: {
							value: function () {
								for (; this.queue.length;) this.queue[0].remove();
								this.progress = 0
							}
						},
						uploadItem: {
							value: function (e) {
								var t = this.getIndexOfItem(e),
									n = this.queue[t],
									r = this.isHTML5 ? "_xhrTransport" : "_iframeTransport";
								n._prepareToUploading(), this.isUploading || (this.isUploading = !0, this[r](n))
							}
						},
						cancelItem: {
							value: function (e) {
								var t = this.getIndexOfItem(e),
									n = this.queue[t],
									r = this.isHTML5 ? "_xhr" : "_form";
								n && n.isUploading && n[r].abort()
							}
						},
						uploadAll: {
							value: function () {
								var e = this.getNotUploadedItems().filter(function (e) {
									return !e.isUploading
								});
								e.length && (u(e, function (e) {
									return e._prepareToUploading()
								}), e[0].upload())
							}
						},
						cancelAll: {
							value: function () {
								var e = this.getNotUploadedItems();
								u(e, function (e) {
									return e.cancel()
								})
							}
						},
						isFile: {
							value: function (e) {
								return this.constructor.isFile(e)
							}
						},
						isFileLikeObject: {
							value: function (e) {
								return this.constructor.isFileLikeObject(e)
							}
						},
						isArrayLikeObject: {
							value: function (e) {
								return this.constructor.isArrayLikeObject(e)
							}
						},
						getIndexOfItem: {
							value: function (e) {
								return c(e) ? e : this.queue.indexOf(e)
							}
						},
						getNotUploadedItems: {
							value: function () {
								return this.queue.filter(function (e) {
									return !e.isUploaded
								})
							}
						},
						getReadyItems: {
							value: function () {
								return this.queue.filter(function (e) {
									return e.isReady && !e.isUploading
								}).sort(function (e, t) {
									return e.index - t.index
								})
							}
						},
						destroy: {
							value: function () {
								var e = this;
								u(this._directives, function (t) {
									u(e._directives[t], function (e) {
										e.destroy()
									})
								})
							}
						},
						onAfterAddingAll: {
							value: function (e) {}
						},
						onAfterAddingFile: {
							value: function (e) {}
						},
						onWhenAddingFileFailed: {
							value: function (e, t, n) {}
						},
						onBeforeUploadItem: {
							value: function (e) {}
						},
						onProgressItem: {
							value: function (e, t) {}
						},
						onProgressAll: {
							value: function (e) {}
						},
						onSuccessItem: {
							value: function (e, t, n, r) {}
						},
						onErrorItem: {
							value: function (e, t, n, r) {}
						},
						onCancelItem: {
							value: function (e, t, n, r) {}
						},
						onCompleteItem: {
							value: function (e, t, n, r) {}
						},
						onCompleteAll: {
							value: function () {}
						},
						_getTotalProgress: {
							value: function (e) {
								if (this.removeAfterUpload) return e || 0;
								var t = this.getNotUploadedItems().length,
									n = t ? this.queue.length - t : this.queue.length,
									r = 100 / this.queue.length,
									i = (e || 0) * r / 100;
								return Math.round(n * r + i)
							}
						},
						_getFilters: {
							value: function (e) {
								if (!e) return this.filters;
								if (p(e)) return e;
								var t = e.match(/[^\s,]+/g);
								return this.filters.filter(function (e) {
									return -1 !== t.indexOf(e.name)
								})
							}
						},
						_render: {
							value: function () {
								t.$$phase || t.$apply()
							}
						},
						_folderFilter: {
							value: function (e) {
								return !(!e.size && !e.type)
							}
						},
						_queueLimitFilter: {
							value: function () {
								return this.queue.length < this.queueLimit
							}
						},
						_isValidFile: {
							value: function (e, t, n) {
								var r = this;
								return this._failFilterIndex = -1, t.length ? t.every(function (t) {
									return r._failFilterIndex++, t.fn.call(r, e, n)
								}) : !0
							}
						},
						_isSuccessCode: {
							value: function (e) {
								return e >= 200 && 300 > e || 304 === e
							}
						},
						_transformResponse: {
							value: function (e, t) {
								var r = this._headersGetter(t);
								return u(n.defaults.transformResponse, function (t) {
									e = t(e, r)
								}), e
							}
						},
						_parseHeaders: {
							value: function (e) {
								var t, n, r, i = {};
								return e ? (u(e.split("\n"), function (e) {
									r = e.indexOf(":"), t = e.slice(0, r).trim().toLowerCase(), n = e.slice(r + 1).trim(), t && (i[t] = i[t] ? i[t] + ", " + n : n)
								}), i) : i
							}
						},
						_headersGetter: {
							value: function (e) {
								return function (t) {
									return t ? e[t.toLowerCase()] || null : e
								}
							}
						},
						_xhrTransport: {
							value: function (e) {
								var t = this,
									n = e._xhr = new XMLHttpRequest,
									r = new g;
								if (this._onBeforeUploadItem(e), u(e.formData, function (e) {
										u(e, function (e, t) {
											r.append(t, e)
										})
									}), "number" != typeof e._file.size) throw new TypeError("The file specified is no longer valid");
								r.append(e.alias, e._file, e.file.name), n.upload.onprogress = function (n) {
									var r = Math.round(n.lengthComputable ? 100 * n.loaded / n.total : 0);
									t._onProgressItem(e, r)
								}, n.onload = function () {
									var r = t._parseHeaders(n.getAllResponseHeaders()),
										i = t._transformResponse(n.response, r),
										o = t._isSuccessCode(n.status) ? "Success" : "Error",
										s = "_on" + o + "Item";
									t[s](e, i, n.status, r), t._onCompleteItem(e, i, n.status, r)
								}, n.onerror = function () {
									var r = t._parseHeaders(n.getAllResponseHeaders()),
										i = t._transformResponse(n.response, r);
									t._onErrorItem(e, i, n.status, r), t._onCompleteItem(e, i, n.status, r)
								}, n.onabort = function () {
									var r = t._parseHeaders(n.getAllResponseHeaders()),
										i = t._transformResponse(n.response, r);
									t._onCancelItem(e, i, n.status, r), t._onCompleteItem(e, i, n.status, r)
								}, n.open(e.method, e.url, !0), n.withCredentials = e.withCredentials, u(e.headers, function (e, t) {
									n.setRequestHeader(t, e)
								}), n.send(r), this._render()
							}
						},
						_iframeTransport: {
							value: function (e) {
								var t = this,
									n = d('<form style="display: none;" />'),
									r = d('<iframe name="iframeTransport' + Date.now() + '">'),
									i = e._input;
								e._form && e._form.replaceWith(i), e._form = n, this._onBeforeUploadItem(e), i.prop("name", e.alias), u(e.formData, function (e) {
									u(e, function (e, t) {
										var r = d('<input type="hidden" name="' + t + '" />');
										r.val(e), n.append(r)
									})
								}), n.prop({
									action: e.url,
									method: "POST",
									target: r.prop("name"),
									enctype: "multipart/form-data",
									encoding: "multipart/form-data"
								}), r.bind("load", function () {
									var n = "",
										i = 200;
									try {
										n = r[0].contentDocument.body.innerHTML
									} catch (o) {
										i = 500
									}
									var s = {
											response: n,
											status: i,
											dummy: !0
										},
										a = {},
										u = t._transformResponse(s.response, a);
									t._onSuccessItem(e, u, s.status, a), t._onCompleteItem(e, u, s.status, a)
								}), n.abort = function () {
									var o, s = {
											status: 0,
											dummy: !0
										},
										a = {};
									r.unbind("load").prop("src", "javascript:false;"), n.replaceWith(i), t._onCancelItem(e, o, s.status, a), t._onCompleteItem(e, o, s.status, a)
								}, i.after(n), n.append(i).append(r), n[0].submit(), this._render()
							}
						},
						_onWhenAddingFileFailed: {
							value: function (e, t, n) {
								this.onWhenAddingFileFailed(e, t, n)
							}
						},
						_onAfterAddingFile: {
							value: function (e) {
								this.onAfterAddingFile(e)
							}
						},
						_onAfterAddingAll: {
							value: function (e) {
								this.onAfterAddingAll(e)
							}
						},
						_onBeforeUploadItem: {
							value: function (e) {
								e._onBeforeUpload(), this.onBeforeUploadItem(e)
							}
						},
						_onProgressItem: {
							value: function (e, t) {
								var n = this._getTotalProgress(t);
								this.progress = n, e._onProgress(t), this.onProgressItem(e, t), this.onProgressAll(n), this._render()
							}
						},
						_onSuccessItem: {
							value: function (e, t, n, r) {
								e._onSuccess(t, n, r), this.onSuccessItem(e, t, n, r)
							}
						},
						_onErrorItem: {
							value: function (e, t, n, r) {
								e._onError(t, n, r), this.onErrorItem(e, t, n, r)
							}
						},
						_onCancelItem: {
							value: function (e, t, n, r) {
								e._onCancel(t, n, r), this.onCancelItem(e, t, n, r)
							}
						},
						_onCompleteItem: {
							value: function (e, t, n, r) {
								e._onComplete(t, n, r), this.onCompleteItem(e, t, n, r);
								var i = this.getReadyItems()[0];
								return this.isUploading = !1, f(i) ? void i.upload() : (this.onCompleteAll(), this.progress = this._getTotalProgress(), void this._render())
							}
						}
					}, {
						isFile: {
							value: function (e) {
								return m && e instanceof m
							}
						},
						isFileLikeObject: {
							value: function (e) {
								return e instanceof v
							}
						},
						isArrayLikeObject: {
							value: function (e) {
								return l(e) && "length" in e
							}
						},
						inherit: {
							value: function (e, t) {
								e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.super_ = t
							}
						}
					}), r
				}();
			return _.prototype.isHTML5 = !(!m || !g), _.isHTML5 = _.prototype.isHTML5, _
		}, e.exports.$inject = ["fileUploaderOptions", "$rootScope", "$http", "$window", "FileLikeObject", "FileItem"]
	}, function (e, t, n) {
		"use strict";
		var r = function (e) {
				return e && e.__esModule ? e["default"] : e
			},
			i = function () {
				function e(e, t) {
					for (var n in t) {
						var r = t[n];
						r.configurable = !0, r.value && (r.writable = !0)
					}
					Object.defineProperties(e, t)
				}
				return function (t, n, r) {
					return n && e(t.prototype, n), r && e(t, r), t
				}
			}(),
			o = function (e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			},
			s = (r(n(2)), angular.copy),
			a = angular.isElement,
			u = angular.isString;
		e.exports = function () {
			var e = function () {
				function e(t) {
					o(this, e);
					var n = a(t),
						r = n ? t.value : t,
						i = u(r) ? "FakePath" : "Object",
						s = "_createFrom" + i;
					this[s](r)
				}
				return i(e, {
					_createFromFakePath: {
						value: function (e) {
							this.lastModifiedDate = null, this.size = null, this.type = "like/" + e.slice(e.lastIndexOf(".") + 1).toLowerCase(), this.name = e.slice(e.lastIndexOf("/") + e.lastIndexOf("\\") + 2)
						}
					},
					_createFromObject: {
						value: function (e) {
							this.lastModifiedDate = s(e.lastModifiedDate), this.size = e.size, this.type = e.type, this.name = e.name
						}
					}
				}), e
			}();
			return e
		}, e.exports.$inject = []
	}, function (e, t, n) {
		"use strict";
		var r = function (e) {
				return e && e.__esModule ? e["default"] : e
			},
			i = function () {
				function e(e, t) {
					for (var n in t) {
						var r = t[n];
						r.configurable = !0, r.value && (r.writable = !0)
					}
					Object.defineProperties(e, t)
				}
				return function (t, n, r) {
					return n && e(t.prototype, n), r && e(t, r), t
				}
			}(),
			o = function (e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			},
			s = (r(n(2)), angular.copy),
			a = angular.extend,
			u = angular.element,
			l = angular.isElement;
		e.exports = function (e, t) {
			var n = function () {
				function n(e, r, i) {
					o(this, n);
					var c = l(r),
						f = c ? u(r) : null,
						p = c ? null : r;
					a(this, {
						url: e.url,
						alias: e.alias,
						headers: s(e.headers),
						formData: s(e.formData),
						removeAfterUpload: e.removeAfterUpload,
						withCredentials: e.withCredentials,
						method: e.method
					}, i, {
						uploader: e,
						file: new t(r),
						isReady: !1,
						isUploading: !1,
						isUploaded: !1,
						isSuccess: !1,
						isCancel: !1,
						isError: !1,
						progress: 0,
						index: null,
						_file: p,
						_input: f
					}), f && this._replaceNode(f)
				}
				return i(n, {
					upload: {
						value: function () {
							try {
								this.uploader.uploadItem(this)
							} catch (e) {
								this.uploader._onCompleteItem(this, "", 0, []), this.uploader._onErrorItem(this, "", 0, [])
							}
						}
					},
					cancel: {
						value: function () {
							this.uploader.cancelItem(this)
						}
					},
					remove: {
						value: function () {
							this.uploader.removeFromQueue(this)
						}
					},
					onBeforeUpload: {
						value: function () {}
					},
					onProgress: {
						value: function (e) {}
					},
					onSuccess: {
						value: function (e, t, n) {}
					},
					onError: {
						value: function (e, t, n) {}
					},
					onCancel: {
						value: function (e, t, n) {}
					},
					onComplete: {
						value: function (e, t, n) {}
					},
					_onBeforeUpload: {
						value: function () {
							this.isReady = !0, this.isUploading = !0, this.isUploaded = !1, this.isSuccess = !1, this.isCancel = !1, this.isError = !1, this.progress = 0, this.onBeforeUpload()
						}
					},
					_onProgress: {
						value: function (e) {
							this.progress = e, this.onProgress(e)
						}
					},
					_onSuccess: {
						value: function (e, t, n) {
							this.isReady = !1, this.isUploading = !1, this.isUploaded = !0, this.isSuccess = !0, this.isCancel = !1, this.isError = !1, this.progress = 100, this.index = null, this.onSuccess(e, t, n)
						}
					},
					_onError: {
						value: function (e, t, n) {
							this.isReady = !1, this.isUploading = !1, this.isUploaded = !0, this.isSuccess = !1, this.isCancel = !1, this.isError = !0, this.progress = 0, this.index = null, this.onError(e, t, n)
						}
					},
					_onCancel: {
						value: function (e, t, n) {
							this.isReady = !1, this.isUploading = !1, this.isUploaded = !1, this.isSuccess = !1, this.isCancel = !0, this.isError = !1, this.progress = 0, this.index = null, this.onCancel(e, t, n)
						}
					},
					_onComplete: {
						value: function (e, t, n) {
							this.onComplete(e, t, n), this.removeAfterUpload && this.remove()
						}
					},
					_destroy: {
						value: function () {
							this._input && this._input.remove(), this._form && this._form.remove(), delete this._form, delete this._input
						}
					},
					_prepareToUploading: {
						value: function () {
							this.index = this.index || ++this.uploader._nextIndex, this.isReady = !0
						}
					},
					_replaceNode: {
						value: function (t) {
							var n = e(t.clone())(t.scope());
							n.prop("value", null), t.css("display", "none"), t.after(n)
						}
					}
				}), n
			}();
			return n
		}, e.exports.$inject = ["$compile", "FileLikeObject"]
	}, function (e, t, n) {
		"use strict";
		var r = function (e) {
				return e && e.__esModule ? e["default"] : e
			},
			i = function () {
				function e(e, t) {
					for (var n in t) {
						var r = t[n];
						r.configurable = !0, r.value && (r.writable = !0)
					}
					Object.defineProperties(e, t)
				}
				return function (t, n, r) {
					return n && e(t.prototype, n), r && e(t, r), t
				}
			}(),
			o = function (e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			},
			s = (r(n(2)), angular.extend);
		e.exports = function () {
			var e = function () {
				function e(t) {
					o(this, e), s(this, t), this.uploader._directives[this.prop].push(this), this._saveLinks(), this.bind()
				}
				return i(e, {
					bind: {
						value: function () {
							for (var e in this.events) {
								var t = this.events[e];
								this.element.bind(e, this[t])
							}
						}
					},
					unbind: {
						value: function () {
							for (var e in this.events) this.element.unbind(e, this.events[e])
						}
					},
					destroy: {
						value: function () {
							var e = this.uploader._directives[this.prop].indexOf(this);
							this.uploader._directives[this.prop].splice(e, 1), this.unbind()
						}
					},
					_saveLinks: {
						value: function () {
							for (var e in this.events) {
								var t = this.events[e];
								this[t] = this[t].bind(this)
							}
						}
					}
				}), e
			}();
			return e.prototype.events = {}, e
		}, e.exports.$inject = []
	}, function (e, t, n) {
		"use strict";
		var r = function (e) {
				return e && e.__esModule ? e["default"] : e
			},
			i = function () {
				function e(e, t) {
					for (var n in t) {
						var r = t[n];
						r.configurable = !0, r.value && (r.writable = !0)
					}
					Object.defineProperties(e, t)
				}
				return function (t, n, r) {
					return n && e(t.prototype, n), r && e(t, r), t
				}
			}(),
			o = function c(e, t, n) {
				var r = Object.getOwnPropertyDescriptor(e, t);
				if (void 0 === r) {
					var i = Object.getPrototypeOf(e);
					return null === i ? void 0 : c(i, t, n)
				}
				if ("value" in r && r.writable) return r.value;
				var o = r.get;
				return void 0 === o ? void 0 : o.call(n)
			},
			s = function (e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (e.__proto__ = t)
			},
			a = function (e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			},
			u = (r(n(2)), angular.extend),
			l = angular.forEach;
		e.exports = function (e) {
			var t = function (e) {
				function t(e) {
					a(this, t);
					var n = u(e, {
						events: {
							$destroy: "destroy",
							drop: "onDrop",
							dragover: "onDragOver",
							dragleave: "onDragLeave"
						},
						prop: "drop"
					});
					o(Object.getPrototypeOf(t.prototype), "constructor", this).call(this, n)
				}
				return s(t, e), i(t, {
					getOptions: {
						value: function () {}
					},
					getFilters: {
						value: function () {}
					},
					onDrop: {
						value: function (e) {
							var t = this._getTransfer(e);
							if (t) {
								var n = this.getOptions(),
									r = this.getFilters();
								this._preventAndStop(e), l(this.uploader._directives.over, this._removeOverClass, this), this.uploader.addToQueue(t.files, n, r)
							}
						}
					},
					onDragOver: {
						value: function (e) {
							var t = this._getTransfer(e);
							this._haveFiles(t.types) && (t.dropEffect = "copy", this._preventAndStop(e), l(this.uploader._directives.over, this._addOverClass, this))
						}
					},
					onDragLeave: {
						value: function (e) {
							e.currentTarget !== this.element[0] && (this._preventAndStop(e), l(this.uploader._directives.over, this._removeOverClass, this))
						}
					},
					_getTransfer: {
						value: function (e) {
							return e.dataTransfer ? e.dataTransfer : e.originalEvent.dataTransfer
						}
					},
					_preventAndStop: {
						value: function (e) {
							e.preventDefault(), e.stopPropagation()
						}
					},
					_haveFiles: {
						value: function (e) {
							return e ? e.indexOf ? -1 !== e.indexOf("Files") : e.contains ? e.contains("Files") : !1 : !1
						}
					},
					_addOverClass: {
						value: function (e) {
							e.addOverClass()
						}
					},
					_removeOverClass: {
						value: function (e) {
							e.removeOverClass()
						}
					}
				}), t
			}(e);
			return t
		}, e.exports.$inject = ["FileDirective"]
	}, function (e, t, n) {
		"use strict";
		var r = function (e) {
				return e && e.__esModule ? e["default"] : e
			},
			i = function () {
				function e(e, t) {
					for (var n in t) {
						var r = t[n];
						r.configurable = !0, r.value && (r.writable = !0)
					}
					Object.defineProperties(e, t)
				}
				return function (t, n, r) {
					return n && e(t.prototype, n), r && e(t, r), t
				}
			}(),
			o = function l(e, t, n) {
				var r = Object.getOwnPropertyDescriptor(e, t);
				if (void 0 === r) {
					var i = Object.getPrototypeOf(e);
					return null === i ? void 0 : l(i, t, n)
				}
				if ("value" in r && r.writable) return r.value;
				var o = r.get;
				return void 0 === o ? void 0 : o.call(n)
			},
			s = function (e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (e.__proto__ = t)
			},
			a = function (e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			},
			u = (r(n(2)), angular.extend);
		e.exports = function (e) {
			var t = function (e) {
				function t(e) {
					a(this, t);
					var n = u(e, {
						events: {
							$destroy: "destroy"
						},
						prop: "over",
						overClass: "nv-file-over"
					});
					o(Object.getPrototypeOf(t.prototype), "constructor", this).call(this, n)
				}
				return s(t, e), i(t, {
					addOverClass: {
						value: function () {
							this.element.addClass(this.getOverClass())
						}
					},
					removeOverClass: {
						value: function () {
							this.element.removeClass(this.getOverClass())
						}
					},
					getOverClass: {
						value: function () {
							return this.overClass
						}
					}
				}), t
			}(e);
			return t
		}, e.exports.$inject = ["FileDirective"]
	}, function (e, t, n) {
		"use strict";
		var r = function (e) {
			return e && e.__esModule ? e["default"] : e
		};
		r(n(2));
		e.exports = function (e, t, n) {
			return {
				link: function (r, i, o) {
					var s = r.$eval(o.uploader);
					if (!(s instanceof t)) throw new TypeError('"Uploader" must be an instance of FileUploader');
					var a = new n({
						uploader: s,
						element: i
					});
					a.getOptions = e(o.options).bind(a, r), a.getFilters = function () {
						return o.filters
					}
				}
			}
		}, e.exports.$inject = ["$parse", "FileUploader", "FileSelect"]
	}, function (e, t, n) {
		"use strict";
		var r = function (e) {
			return e && e.__esModule ? e["default"] : e
		};
		r(n(2));
		e.exports = function (e, t, n) {
			return {
				link: function (r, i, o) {
					var s = r.$eval(o.uploader);
					if (!(s instanceof t)) throw new TypeError('"Uploader" must be an instance of FileUploader');
					if (s.isHTML5) {
						var a = new n({
							uploader: s,
							element: i
						});
						a.getOptions = e(o.options).bind(a, r), a.getFilters = function () {
							return o.filters
						}
					}
				}
			}
		}, e.exports.$inject = ["$parse", "FileUploader", "FileDrop"]
	}, function (e, t, n) {
		"use strict";
		var r = function (e) {
			return e && e.__esModule ? e["default"] : e
		};
		r(n(2));
		e.exports = function (e, t) {
			return {
				link: function (n, r, i) {
					var o = n.$eval(i.uploader);
					if (!(o instanceof e)) throw new TypeError('"Uploader" must be an instance of FileUploader');
					var s = new t({
						uploader: o,
						element: r
					});
					s.getOverClass = function () {
						return i.overClass || s.overClass
					}
				}
			}
		}, e.exports.$inject = ["FileUploader", "FileOver"]
	}])
});
//# sourceMappingURL=angular-file-upload.min.js.map