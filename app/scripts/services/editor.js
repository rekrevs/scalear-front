angular.module('scalearAngularApp').factory('editor',
    ['$q', '$rootScope', '$log', '$timeout', 'doc', function ($q, $rootScope, $log, $timeout, doc) {
        var ONE_HOUR_IN_MS = 1000 * 60 * 60;
        var editor = null,
            EditSession = require("ace/edit_session").EditSession,
            service = $rootScope.$new(true);

        service.doc = doc;
        service.loading = false;
        service.loading = false;
        service.saving = false;
        service.savingErrors = 0;
        service.lastRow = -1;
        service.video="";



        console.log(doc);

        service.focusEditor = function () {
            console.log("focuseditor")
            editor && editor.focus();
        };

        service.rebind = function (element) {
            console.log("rebind")
            editor = ace.edit(element);
            editor.commands.removeCommand('splitline');
            editor.commands.removeCommand('golinedown');
            editor.on("gutterclick", function (e) {
                var lineCursorPosition = e.getDocumentPosition().row;

                //if (doc.info.syncNotesVideo) {
                    service.jump(lineCursorPosition);
                //}
            });
            service.updateEditor(doc.info);
        };

        service.snapshot = function () {
            console.log("snapshot");

            doc.dirty = false;
            var data = angular.extend({}, doc.info);
            if (doc.info.editable) {
                data.content = doc.info.content;
            }
            return data;
        };
        service.create = function (url, player, parentId) {
            console.log(url);
            console.log(player.controls.getTime())
            service.url=url;
            service.video=player;
            var vs= {
                version: 2,
                content: '',
                currentVideo: url,
                videos: {},
                syncNotesVideo: true,
                labels: {
                    starred: false
                },
                editable: true,
                title: 'Untitled notes',
                description: '',
                mimeType: 'application/vnd.unishared.document',
                parent: parentId || null
            }

            vs["videos"][url]={}
            //console.log(player);
            //console.log(player.controls.getDuration());

            doc.dirty = true;

            service.updateEditor(vs);
        };
        service.copy = function (templateId) {
            console.log("copy")
            $log.info("Copying template", templateId);
//            backend.copy(templateId).then(angular.bind(service,
//                function (result) {
//                    doc.info.id = result.id;
//                    $rootScope.$broadcast('copied', result.id);
//                }),
//                angular.bind(service, function () {
//                    $log.warn("Error copying", templateId);
//                    $rootScope.$broadcast('error', {
//                        action: 'copy',
//                        message: "An error occurred while copying the template"
//                    });
//                }));
        };
        service.load = function (id, reload) {
            console.log("load");
            $log.info("Loading resource", id, doc && doc.info && doc.info.id);
            console.log("Loading resource", id, doc && doc.info && doc.info.id);
            if (!reload && doc.info && doc.info.id === id) {
                service.updateEditor(doc.info);
                return $q.when(doc.info);
            }
            service.loading = true;
            $rootScope.$broadcast('loading');
//            return backend.load(id).then(
//                function (result) {
//                    service.loading = false;
//                    service.updateEditor(result.data);
//                    doc.info.id = id;
//                    $rootScope.$broadcast('loaded', doc.info);
//                    return result;
//                },
//                function (result) {
//                    $log.warn("Error loading", result);
//                    service.loading = false;
//                    $rootScope.$broadcast('error', {
//                        action: 'load',
//                        message: "An error occured while loading the file"
//                    });
//                    return result;
//                });
        };
        service.save = function (newRevision) {
            console.log("save")
            $log.info("Saving file", newRevision);
            if (service.saving || service.loading) {
                throw 'Save called from incorrect state';
            }
            service.saving = true;
            var file = service.snapshot();
            console.log("file is");
            console.log(file);

            // what is saved is the file, along with its revision. (as a param)
            if (!doc.info.id) {
                $rootScope.$broadcast('firstSaving');
            }
            else {
                $rootScope.$broadcast('saving');
            }

            // Force revision if first save of the session
            newRevision = newRevision || doc.timeSinceLastSave() > ONE_HOUR_IN_MS;
            //var promise = backend.save(file, newRevision);
//            promise.then(
//                function (result) {
//                    $log.info("Saved file", result);
//                    service.saving = false;
//                    service.savingErrors = 0;
//
//                    if (!doc.info.id) {
//                        doc.info.id = result.data.id;
//                        $rootScope.$broadcast('firstSaved', doc.info.id);
//                    }
//
//                    doc.lastSave = new Date().getTime();
//                    $rootScope.$broadcast('saved', doc.info);
//                    return doc.info;
//                },
//                function (result) {
//                    service.saving = false;
//                    service.savingErrors++;
//                    doc.dirty = true;
//
//                    if (service.savingErrors === 5) {
//                        doc.info.editable = false;
//                        $rootScope.$broadcast('error', {
//                            action: 'save',
//                            message: "Too many errors occurred while saving the file. Please contact us"
//                        });
//                    }
//                    else if(result.status === 403) {
//                        doc.info.editable = false;
//                        $rootScope.$broadcast('error', {
//                            action: 'save',
//                            message: "You are not authorized to save or update this file. Please contact us"
//                        });
//                    }
//                    else {
//                        $rootScope.$broadcast('error', {
//                            action: 'save',
//                            message: "An error occurred while saving the file"
//                        });
//                    }
//
//                    return result;
//                });
            return 0//promise;
        };

        service.jump = function (line) {
            console.log("jump")
            var timestamp, videoUrl;
            console.log(doc.info.videos);
            for(var sync in doc.info.videos) {
                if(doc.info.videos[sync][line]) {
                    timestamp = doc.info.videos[sync][line]['time'];
                    videoUrl = sync;
                    break;
                }
            }

            if (typeof timestamp !== "undefined" && typeof videoUrl !== "undefined") {
                $log.info('Timestamp', line, timestamp);
                if (timestamp > -1) {
                    if(service.url !== videoUrl) {
                        doc.info.currentVideo = videoUrl;
                        service.url = doc.info.currentVideo;
                        //video.load();
                       // var offListener = service.$on('video::loadeddata', function () {
                         //   video.currentTime(timestamp);
                           // offListener();
                        //});
                    }
                    else {
                        service.video.controls.seek(timestamp);
                    }

                    editor.gotoLine(line+1);
                    editor.navigateLineEnd();
                }
            }
            else {
                $log.info('No timestamp');
            }
        };

        service.updateEditor = function (fileInfo) {
            console.log("woohoo!" + fileInfo)

            if (!fileInfo) {
                return;
            }

            $log.info("Updating editor", fileInfo);

            var session = new EditSession(fileInfo.content);
            session.setUseWrapMode(true);
            session.setWrapLimitRange(80);

            session.on('change', function () {
                console.log("in change")
                if (doc && doc.info) {
                    $rootScope.safeApply(function () {
                        doc.info.content = session.getValue();
                        console.log("in change!!!!!!")
                        console.log(doc.info);
                    });
                }
            });

            session.$breakpointListener = function (e) {

                console.log("over here! in breakpoint");

                var currentSync = service.getCurrentSync();
                if (!doc.info || !currentSync)
                    return;
                var delta = e.data;
                var range = delta.range;
                console.log(range.end.row);
                console.log(range.start.row);
                if (range.end.row == range.start.row) {
                    // Removing sync mark if line is now empty
                    if (session.getLine(range.start.row).trim() === '') {
                        service.unsync(range.start.row);
                    }
                    else if (!(range.start.row in currentSync)) {
                        console.log("wll call sync")
                        service.syncLine(range.start.row, true);
                    }

                    return;
                }

                var firstRow, shift;
                if (delta.action == "insertText") {
                    firstRow = range.start.column ? range.start.row + 1 : range.start.row;
                    shift = 1;
                }
                else {
                    firstRow = range.start.row;
                    shift = -1;
                }

                var shiftedSyncNotesVideo = {};
                for (var line in currentSync) {
                    var intLine = parseInt(line);
                    if (!isNaN(intLine)) {
                        if (line < firstRow) {
                            shiftedSyncNotesVideo[line] = currentSync[line];
                        }
                        else {
                            var nextLine = parseInt(line) + shift;
                            shiftedSyncNotesVideo[nextLine] = currentSync[line];
                        }
                    }
                }
                doc.info.videos[doc.info.currentVideo] = shiftedSyncNotesVideo;

                service.updateBreakpoints();
            }.bind(session);
            session.on("change", session.$breakpointListener);

            session.getSelection().on('changeCursor', function (e) {
                var lineCursorPosition = editor.getCursorPosition().row;
                console.log("in get selection");
                console.log(lineCursorPosition);
                if (lineCursorPosition != service.lastRow) {
                    service.lastRow = lineCursorPosition;

                    if (doc.info.syncNotesVideo) {
                        service.jump(service.lastRow);
                    }
                }
            });

            if(editor) {
                editor.setSession(session);
                editor.focus();
            }

            console.log("over here")
            doc.lastSave = 0;
            doc.info = fileInfo;

            service.updateBreakpoints();
            service.jump(0);
        };
        service.updateBreakpoints = function () {
            console.log("update breakpoints")
            if (doc.info) {
                var session = editor.getSession(),
                    annotations = [],
                    breakpoints = [];

                session.clearBreakpoints();
                for(var sync in doc.info.videos) {
                    for (var line in doc.info.videos[sync]) {
                        var timestamp = parseFloat(doc.info.videos[sync][line].time);
                        if (timestamp > -1)
                        {
                            var minutes = parseInt(timestamp / 60, 10) % 60,
                                seconds = ("0" + parseInt(timestamp % 60, 10)).slice(-2);

                            breakpoints.push(line);
                            annotations.push({row:line, text:
                                '{0}:{1}'.format(minutes, seconds)});
                        }
                    }
                }

                session.setBreakpoints(breakpoints);
                session.setAnnotations(annotations);
            }
        };

        service.getCurrentSync = function (line) {
            console.log(line);
            console.log("getcurrentsync");
            console.log(doc.info.currentVideo)
            if (doc.info.currentVideo) {
                var currentSync = doc.info.videos[doc.info.currentVideo];
                if (undefined != line) {
                    if(!currentSync[line]) {
                        currentSync[line] = {
                            time: null
                        };
                    }
                console.log(currentSync);
                    return currentSync[line];
                }

                return doc.info.videos[doc.info.currentVideo];
            }
        };

        service.syncLine = function (line, shift) {
            console.log("syncline");
            // Is there a video loaded?
            var currentSync = service.getCurrentSync(),
                currentSyncLine = service.getCurrentSync(line),
                currentTime = service.video.controls.getTime();

            if (doc.info && doc.info.currentVideo) {
                $log.info('Video loaded');

                // Is there some texts before and after?
                var timestampBefore, isLineBefore = false,
                    timestampAfter, isLineAfter = false;

                for (var lineSynced in currentSync) {
                    if (!isLineBefore && lineSynced < line) {
                        isLineBefore = true;
                        timestampBefore = currentSync[lineSynced].time;
                    }
                    else if (!isLineAfter && lineSynced > line) {
                        isLineAfter = true;
                        timestampAfter = currentSync[lineSynced].time;
                    }

                    if (isLineBefore && isLineAfter) {
                        break;
                    }
                }

                if (isLineBefore && isLineAfter && (currentTime < timestampBefore || currentTime > timestampAfter)) {
                    // Text before and after and video currently further (refactoring mode)
                    // Timestamp for this line must be average time between nearest line before/after
                    currentSyncLine.time = (timestampBefore + timestampAfter) / 2;
                }
                else {
                    // No text or only before / after
                    // Using current player time minus a delta
                    if(shift) {
                        if(parseInt(currentTime - 3, 10) > 0) {
                            currentSyncLine.time = currentTime - 3;
                        }
                        else {
                            currentSyncLine.time = currentTime - currentTime;
                        }
                    }
                    else {
                        currentSyncLine.time = currentTime;
                    }
                }

                $log.info('Setting timestamp', line, currentSyncLine.time);
                this.updateBreakpoints();
            }
            // No video => mark it anyway, don't want to sync this line
            else {
                $log.info('No video');
                currentSyncLine.time = -1
            }
        };

        service.setSnapshot = function (snapshot) {
            console.log("snap");
            var lineCursorPosition = editor.getCursorPosition().row,
                currentSync = service.getCurrentSync(lineCursorPosition),
                snapshotSymbol = '<snapshot>',
                session = editor.getSession();

            if(session.getLine(lineCursorPosition).indexOf(snapshotSymbol) === -1) {
                session.insert({row:lineCursorPosition, column:0}, snapshotSymbol + '\n');
                service.syncLine(lineCursorPosition, false);
                editor.focus();
            }

            currentSync.snapshot = snapshot;
        };

        service.unsync = function (line) {
            console.log("unsync");
            var currentSync = service.getCurrentSync(line),
                session = editor.getSession();

            if (doc.info && currentSync) {
                delete doc.info.videos[doc.info.currentVideo][line];
                service.updateBreakpoints();
            }
        };

        service.state = function () {
            console.log("state")
            if (service.loading) {
                return EditorState.LOAD;
            } else if (service.saving) {
                return EditorState.SAVE;
            } else if (doc.info && !doc.info.editable) {
                return EditorState.READONLY;
            }
            else if (doc.dirty) {
                return EditorState.DIRTY;
            }
            return EditorState.CLEAN;
        };

        service.$on('video::seeked', function () {
            service.focusEditor();
        });
        service.$on('video::ratechange', function () {
            service.focusEditor();
        });
        service.$on('video::play', function () {
            service.focusEditor();
        });
        service.$on('video::pause', function () {
            service.focusEditor();
        });
        service.$on('saving', function () {
            service.focusEditor();
        });
        service.$on('loading', function () {
            service.focusEditor();
        });

        service.$watch('doc.info.syncVideoNotes', function () {
            service.focusEditor();
        });

        service.$watch('doc.info.editable', function (newValue, oldValue) {
            if (editor && newValue !== oldValue) {
                editor.setReadOnly(!newValue);
            }
        });

        service.focusEditor();

        return service;
    }]);

