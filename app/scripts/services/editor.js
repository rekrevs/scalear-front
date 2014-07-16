angular.module('scalearAngularApp').factory('editor',
    ['$state','$q', '$rootScope', '$log', '$timeout', 'doc','$stateParams','Lecture','$window','$interval','util', function ($state,$q, $rootScope, $log, $timeout, doc, $stateParams, Lecture, $window, $interval, util) {
        return function() {

        //console.log("new editor");

        var ONE_HOUR_IN_MS = 1000 * 60 * 60;
        var saveInterval=15000;
        var editor = null,
            EditSession = require("ace/edit_session").EditSession,
            //Tooltip= require("ace/mouse/default_gutter_handler").GutterHandler,
            service = $rootScope.$new(true);

        //console.log(Tooltip);
        service.doc = new doc();
        //service.loading = false;
        //service.saving = false;
        service.savingErrors = 0;
        service.lastRow = -1;
        service.video="";
        service.autosave="";
        service.lecture_id="";



        //console.log(doc);

        service.focusEditor = function () {
            //console.log("focuseditor")
            editor && editor.focus();
        };

        service.rebind = function (element) {
            //console.log("rebind")
            editor = ace.edit(element);
            editor.commands.removeCommand('splitline');
            editor.commands.removeCommand('golinedown');
            editor.resize();
            editor.on("gutterclick", function (e) {
                var lineCursorPosition = e.getDocumentPosition().row;

                //if (doc.info.syncNotesVideo) {
                    service.jump(lineCursorPosition);
                //}
            });
//            editor.on("guttermousemove", function(e){
//                console.log("row "+ service.getCurrentSync(e.getDocumentPosition().row).time);
//                //var tooltip = Tooltip(editor);
//
////                var target = e.domEvent.target;
////                if (target.className.indexOf("ace_gutter-cell") == -1)
////                    return;
////                if (!editor.isFocused())
////                    return;
////                if (e.clientX > 25 + target.getBoundingClientRect().left)
////                    return;
////
////                var row = e.getDocumentPosition().row
////                e.editor.session.setBreakpoint(row)
////                e.stop()
//            });
            service.updateEditor(service.doc.info);
        };

        service.snapshot = function () {
            //console.log("snapshot!!!!!!!!!!!!!!!!!!!!!");

            service.doc.dirty = false;
            var data = angular.extend({}, service.doc.info);
            //if (service.doc.info.editable) {
                data.content = service.doc.info.content;
            //}
            //console.log(data);
            return data;
        };
        service.create = function (url, player,lecture_id,cumulative_duration,lecture_name,note, seek, parentId) {
            service.lecture_id=lecture_id
            service.lecture_name=lecture_name;
            service.cumulative_duration=cumulative_duration;
            service.note=note;
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
            service.url=url;
            service.video=player;
            service.seek = seek()
            //service.loading = true;
            //doc.dirty = true;
            //$rootScope.$broadcast('loading');

            if(service.note)
                service.updateEditor(service.note.data);
            else
                service.updateEditor(vs);

            if(service.doc.info.content.trim()==='')
                // service.insert(0,"f", "note")
            service.doc.initWatcher();
            service.initTimeout();
            editor.on("focus", function (e) {
               service.seek(-1, service.lecture_id)
            });

//            Lecture.loadNote({
//                course_id: $stateParams.course_id,
//                lecture_id: lecture_id
//            }, function(response){
//                service.loading = false;
//                if(response.exists)
//                    service.updateEditor(response.note.data);
//                else
//                    service.updateEditor(vs);
//
//                if(service.doc.info.content.trim()==='')
//                    service.insert(0,"Start of Lecture "+service.lecture_name, "note")
//                service.doc.initWatcher();
//                service.initTimeout();
//                //$rootScope.$broadcast('loaded', service.doc.info);
//            }, function(response){
//               // $log.warn("Error loading", response);
//                service.loading = false;
//            });




            //console.log(player);
            //console.log(player.controls.getDuration());



            //service.updateEditor(vs);

        };
        service.copy = function (templateId) {
            //console.log("copy")
            //$log.info("Copying template", templateId);
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
//            console.log("load");
            //$log.info("Loading resource", id, doc && doc.info && doc.info.id);
//            console.log("Loading resource", id, doc && doc.info && doc.info.id);
//            if (!reload && doc.info ) { //&& doc.info.id === id
//                service.updateEditor(doc.info);
//                return $q.when(doc.info);
//            }
//            service.loading = true;
//            $rootScope.$broadcast('loading');
//
//            Lecture.loadNote({
//                course_id: $stateParams.course_id,
//                lecture_id: $stateParams.lecture_id
//            }, function(response){
//                service.loading = false;
//                service.updateEditor(response.data);
//                $rootScope.$broadcast('loaded', doc.info);
//            }, function(response){
//                $log.warn("Error loading", response);
//                service.loading = false;
//            });

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
            //console.log("save")
            //$log.info("Saving file", newRevision);
//            if (service.saving || service.loading) {
//                throw 'Save called from incorrect state';
//            }
//            service.saving = true;
            var file = service.snapshot();
            //console.log("saving file ");
            //console.log(file);
            //console.log("file is");
            //console.log(file);

            // what is saved is the file, along with its revision. (as a param)
//            if (!service.doc.info.id) {
//                $rootScope.$broadcast('firstSaving');
//            }
//            else {
//                $rootScope.$broadcast('saving');
//            }

            // Force revision if first save of the session
            newRevision = newRevision || service.doc.timeSinceLastSave() > ONE_HOUR_IN_MS;
            Lecture.saveNote({
                course_id: $stateParams.course_id,
                lecture_id: service.lecture_id
            }, {
                data: file
            }, function(response){
                //$log.info("Saved file", response);
                //service.saving = false;
                service.savingErrors = 0;
                service.doc.lastSave = new Date().getTime();
            }, function(response){
                //service.saving = false;
                service.savingErrors++;
                service.doc.dirty = true;
            });
            //var promise = backend.save(file, newRevision);
//            promise.then(
//                function (result) {
//                    $log.info("Saved file", result);
//                    service.saving = false;
//                    service.savingErrors = 0;
//
//                    if (!service.doc.info.id) {
//                        service.doc.info.id = result.data.id;
//                        $rootScope.$broadcast('firstSaved', service.doc.info.id);
//                    }
//
//                    service.doc.lastSave = new Date().getTime();
//                    $rootScope.$broadcast('saved', service.doc.info);
//                    return service.doc.info;
//                },
//                function (result) {
//                    service.saving = false;
//                    service.savingErrors++;
//                    service.doc.dirty = true;
//
//                    if (service.savingErrors === 5) {
//                        service.doc.info.editable = false;
//                        $rootScope.$broadcast('error', {
//                            action: 'save',
//                            message: "Too many errors occurred while saving the file. Please contact us"
//                        });
//                    }
//                    else if(result.status === 403) {
//                        service.doc.info.editable = false;
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
            //console.log("jump")
            var timestamp, videoUrl;
            //console.log(service.doc.info.videos);
            for(var sync in service.doc.info.videos) {
                if(service.doc.info.videos[sync][line]) {
                    timestamp = service.doc.info.videos[sync][line]['time'];
                    videoUrl = sync;
                    break;
                }
            }

            if (typeof timestamp !== "undefined" && typeof videoUrl !== "undefined") {
                //$log.info('Timestamp', line, timestamp);
                if (timestamp > -1) {
                    if(service.url !== videoUrl) {
                        service.doc.info.currentVideo = videoUrl;
                        service.url = service.doc.info.currentVideo;
                        //video.load();
                       // var offListener = service.$on('video::loadeddata', function () {
                         //   video.currentTime(timestamp);
                           // offListener();
                        //});
                    }
                    else {
                        service.seek(timestamp, service.lecture_id)
                        // if(service.lecture_id == $stateParams.lecture_id){ //if current lecture
                        //     //$scope.lecture_player.controls.seek_and_pause(time)
                        //     service.video.controls.seek(timestamp);
                        // }
                        // else{
                        //     // console.log("switch to different")
                        //     // $state.go("course.module.courseware.lecture", {"lecture_id":service.lecture_id, "tab":1});
                        //     $state.go("course.module.courseware.lecture", {lecture_id:lecture_id}, {reload:false, notify:false});  
                        //     return;
                        // }
                    }

                    editor.gotoLine(line+1);
                    editor.navigateLineEnd();
                }
            }
            else {
                //$log.info('No timestamp');
            }
        };

        // To insert text manually.
        service.insert = function (time, question, note) {
//            console.log(line);

            var position=-1;
             var text= question.toUpperCase();
            // if(!note)
            //     var text= question.toUpperCase();
            // else{
            //     var text= question.toUpperCase();
            // }
            //var time= 50;
            var currentSync= service.getCurrentSync();
            var element=-1;
            for(element in currentSync){
                //console.log("element "+element+" time is ");
                //console.log(currentSync[element].time)
                if(parseInt(currentSync[element].time)>parseInt(time))
                {
                    position=element
                  //  console.log("position isssssssssssss "+position);
                    break;
                }
            }

            snapshotSymbol = '<snapshot>',
            session = editor.getSession();
            element= parseInt(element);
            if(position==-1) // largest element // put at the end.
            {
                // if currentSync not empty, want to push time one row ta7t

                //console.log("element is "+parseInt(element+1))
                // console.log("hello")
                session.insert({row:(element+1), column:0}, "\n");
                service.doc.info.videos[service.doc.info.currentVideo][parseInt(element+1)]={time:parseInt(time)};
                session.insert({row:(parseInt(element+1)), column:0},  " \n");
                currentSyncLine = service.getCurrentSync(parseInt(element+1));
                currentSyncLine.time=time;
                //console.log(currentSyncLine);


            }else{

                // here need to move everything down one row first.
                console.log("world")

                position=parseInt(position);
                session.insert({row:(position), column:0}, "\n");
                service.doc.info.videos[service.doc.info.currentVideo][position]={time:parseInt(time)};
                session.insert({row:(position), column:0}, text + "\n");
                currentSyncLine = service.getCurrentSync(position);
                currentSyncLine.time=time;

            }

        }

        service.updateEditor = function (fileInfo) {
            //console.log("woohoo!" + fileInfo)

            if (!fileInfo) {
                return;
            }

            //$log.info("Updating editor", fileInfo);

            var session = new EditSession(fileInfo.content);
            session.setUseWrapMode(true);
            session.setWrapLimitRange(80);

            session.on('change', function () {
                //console.log("in change")
                if (service.doc && service.doc.info) {
                    util.safeApply(function () {
                        service.doc.info.content = session.getValue();
                        ///console.log("in change!!!!!!")
                        //console.log(service.doc.info);
                    });
                }
            });

            session.$breakpointListener = function (e) {


                var currentSync = service.getCurrentSync();
                if (!service.doc.info || !currentSync)
                    return;
                var delta = e.data;
                var range = delta.range;
                //console.log(range.end.row);
                //console.log(range.start.row);
                if (range.end.row == range.start.row) {
                    // Removing sync mark if line is now empty
                    //console.log("line is")
                    //console.log(session.getLine(range.start.row));
                    if (session.getLine(range.start.row).trim() === '') {
                        service.unsync(range.start.row);
                    }
                    else if (!(range.start.row in currentSync)) {
                        //console.log(currentSync);
                        //console.log("wll call sync")
                        //console.log(range.start.row );
                        service.syncLine(range.start.row, false);
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
                for (var line in currentSync) {// here
                    //console.log("line: "+line)
                    //console.log(currentSync[line]);
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
                service.doc.info.videos[service.doc.info.currentVideo] = shiftedSyncNotesVideo;

                service.updateBreakpoints();
            }.bind(session);
            session.on("change", session.$breakpointListener);

            session.getSelection().on('changeCursor', function (e) {
                var lineCursorPosition = editor.getCursorPosition().row;
                //console.log("in get selection");
                //console.log(lineCursorPosition);
                if (lineCursorPosition != service.lastRow) {
                    service.lastRow = lineCursorPosition;

                   // if (service.doc.info.syncNotesVideo) {
                        service.jump(service.lastRow);
                  //  }
                }
            });

            if(editor) {
                editor.setSession(session);
                editor.focus();
            }

            //console.log("over here")
            service.doc.lastSave = 0;
            service.doc.info = fileInfo;

            service.updateBreakpoints();
            //service.jump(0); //jumps to time of line 0, so if not 0, video jumps from the beginning, don't want that.
        };
        service.updateBreakpoints = function () {
            //console.log("update breakpoints")
            if (service.doc.info) {
                var session = editor.getSession(),
                    annotations = [],
                    breakpoints = [];

                session.clearBreakpoints();
                for(var sync in service.doc.info.videos) {
                    for (var line in service.doc.info.videos[sync]) {
                        var timestamp = parseFloat(service.doc.info.videos[sync][line].time);
                        if (timestamp > -1)
                        {
                            var hours2= parseInt((timestamp + service.cumulative_duration)/60/60,10)
                            var minutes2 = parseInt((timestamp + service.cumulative_duration) / 60, 10) % 60,
                                seconds2 = ("0" + parseInt((timestamp+service.cumulative_duration) % 60, 10)).slice(-2);

                            var hours= parseInt((timestamp)/60/60,10)
                            var minutes = parseInt((timestamp) / 60, 10) % 60,
                                seconds = ("0" + parseInt((timestamp) % 60, 10)).slice(-2);

                            breakpoints.push(line);
                            annotations.push({row:line, text:
                                "{0}:{1}:{2}".format(hours, minutes, seconds)}); // change these to be relative to module.
                        }
                    }
                }

                session.setBreakpoints(breakpoints);
                session.setAnnotations(annotations);
            }
        };

        service.getCurrentSync = function (line) {
//            console.log(line);
            //console.log("getcurrentsync");
            //console.log(service.doc.info.videos[service.doc.info.currentVideo])
            if (service.doc.info.currentVideo) {
                var currentSync = service.doc.info.videos[service.doc.info.currentVideo];
                if(service.doc.info.content.trim()==='') // This condition here to empty everything on ctrl+a delete.
                {
                    service.doc.info.videos[service.doc.info.currentVideo]={}
                    return {}
                }
                if (undefined != line) {
                    //console.log("not undefined it is");
                    //console.log(currentSync);
                    if(!currentSync[line]) {
                        currentSync[line] = {
                            time: null
                        };
                    }
                //console.log(currentSync);
                    return currentSync[line];
                }

                return service.doc.info.videos[service.doc.info.currentVideo];
            }
        };

        service.syncLine = function (line, shift) {
            //console.log("syncline");
            // Is there a video loaded?
            //console.log("in sync lineeeee");
            var currentSync = service.getCurrentSync(),
                currentSyncLine = service.getCurrentSync(line),
                currentTime = service.video.controls.getTime();

            //console.log(currentTime);
            //console.log("current sync issss");
            //console.log(currentSync)
            if (service.doc.info && service.doc.info.currentVideo) {
                //$log.info('Video loaded');

                // Is there some texts before and after?
                var timestampBefore, isLineBefore = false,
                    timestampAfter, isLineAfter = false;

                for (var lineSynced in currentSync) {
                    if (lineSynced < line) { //!isLineBefore &&
                        //isLineBefore = true;

                       // console.log("in before here");
                        //console.log(lineSynced);
                        //console.log(currentSync[lineSynced].time);
                        timestampBefore = currentSync[lineSynced].time;
                    }
                    else if (!isLineAfter && lineSynced > line) {
                        isLineAfter = true;
                        isLineBefore= true;
                        timestampAfter = currentSync[lineSynced].time;
                        if(!timestampBefore)
                            timestampBefore= 0
                    }

                    if (isLineBefore && isLineAfter) {
                        break;
                    }
                }

                if (isLineBefore && isLineAfter && (currentTime < timestampBefore || currentTime > timestampAfter)) {
                    // Text before and after and video currently further (refactoring mode)
                    // Timestamp for this line must be average time between nearest line before/after
                    currentSyncLine.time = (timestampBefore + timestampAfter) / 2;
                   // console.log(timestampBefore);
                   // console.log(timestampAfter);
                   // console.log("in second one  "+currentSyncLine.time);
                }
                else {
                    // No text or only before / after
                    // Using current player time minus a delta
                    if(shift) {
                        if(parseInt(currentTime - 3, 10) > 0) {
                           // console.log("first condition" +currentTime);
                            currentSyncLine.time = currentTime - 3;
                        }
                        else {
                            currentSyncLine.time = currentTime - currentTime;
                            //console.log("second condition" +currentSyncLine.time);
                        }
                    }
                    else {
                        currentSyncLine.time = currentTime;
                        //console.log("no shift "+currentSyncLine.time)
                    }
                }

                //$log.info('Setting timestamp', line, currentSyncLine.time);
                this.updateBreakpoints();
            }
            // No video => mark it anyway, don't want to sync this line
            else {
                $log.info('No video');
                currentSyncLine.time = -1
            }
        };

        service.setSnapshot = function (snapshot) {
            //console.log("snap");
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
            //console.log("unsync");
            var currentSync = service.getCurrentSync(line),
                session = editor.getSession();

            if (service.doc.info && currentSync) {
                delete service.doc.info.videos[service.doc.info.currentVideo][line];
                service.updateBreakpoints();
            }
        };

//        service.state = function () {
//            //console.log("state")
//            if (service.loading) {
//                return EditorState.LOAD;
//            } else if (service.saving) {
//                return EditorState.SAVE;
//            } else if (service.doc.info && !service.doc.info.editable) {
//                return EditorState.READONLY;
//            }
//            else if (service.doc.dirty) {
//                return EditorState.DIRTY;
//            }
//            return EditorState.CLEAN;
//        };

//        service.$on('video::seeked', function () {
//            service.focusEditor();
//        });
//        service.$on('video::ratechange', function () {
//            service.focusEditor();
//        });
//        service.$on('video::play', function () {
//            service.focusEditor();
//        });
//        service.$on('video::pause', function () {
//            service.focusEditor();
//        });
//        service.$on('saving', function () {
//            service.focusEditor();
//        });
//        service.$on('loading', function () {
//            service.focusEditor();
//        });

        service.$watch('service.doc.info.syncVideoNotes', function () {
            service.focusEditor();
        });

        service.$watch('service.doc.info.editable', function (newValue, oldValue) {
            if (editor && newValue !== oldValue) {
                editor.setReadOnly(!newValue);
            }
        });

        // autosaving

        service.confirmOnLeave = function (e) {
            if (service.doc.dirty) {
                var msg = "You have unsaved data.";

                // For IE and Firefox
                e = e || window.event;
                if (e) {
                    e.returnValue = msg;
                }

                // For Chrome and Safari
                return msg;
            }

        };

        // this happens if we go to another site. but need also to do it on state change.
        $window.addEventListener('beforeunload', service.confirmOnLeave);


           // removed for now, because keeps bugging me when going from one lecture to another.
//        $rootScope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
//            if(service.doc.dirty && !confirm("You have unsaved changes, do you want to continue?"))
//                ev.preventDefault();
//        })

        service.saveFn = function () {
           // console.log(service.doc.dirty);
            if (service.doc.dirty) {
                service.save(false);
            }
        };

        service.initTimeout = function () {
            //console.log("info is");
            //console.log(service.doc.info);
            if (service.doc.info) {
                var createTimeout = function () {
                    service.autosave=$interval(service.saveFn, saveInterval)
                };

                createTimeout();
            }
        };

        //service.$on('firstSaved', initTimeout);
        //service.$on('loaded', initTimeout);

        service.focusEditor();

        return service;
        }
    }]);

