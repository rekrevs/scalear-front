angular.module('scalearAngularApp')
    .controller('schoolGdprDownloadCtrl', ['$scope', '$rootScope', 'UserSession', 'User', 'Page','$translate', function ($scope, $rootScope, UserSession, User, Page, $translate) {

        Page.setTitle('GDPR');
        $rootScope.subheader_message = 'GDPR'
        var admin_email;
        $scope.email_sent = false;
        $scope.student_email = '';

        UserSession.getCurrentUser()
            .then(function (user) {
                admin_email = user.email
            })

        $scope.sendStudentsGdpr = function () {
            angular.element('#send_gdpr')[0].textContent = $translate.instant('gdpr.checking_out')
            angular.element('#send_gdpr')[0].disabled = true

            User.sendStudentActivityFile({
                admin_email: admin_email,
                student_email: $scope.student_email
            }, function (data) {
                angular.element('#unprocessable_students').show()
                $scope.student_email = ""

                if (data.unprocessable_students && !data.processable_students) {
                    angular.element('#send_gdpr')[0].textContent = $translate.instant('gdpr.send_email')
                    $scope.unprocessable_students = data.unprocessable_students.toString();

                    setTimeout(() => {
                        angular.element('#unprocessable_students').hide()
                        angular.element('#send_gdpr')[0].disabled = false
                        $scope.unprocessable_students = ""
                    }, 3000);

                } else if (data.unprocessable_students && data.processable_students) {
                    angular.element('#send_gdpr')[0].textContent = $translate.instant('gdpr.email_sent')
                    $scope.unprocessable_students = data.unprocessable_students.toString();

                    setTimeout(() => {
                        angular.element('#unprocessable_students').hide()
                        angular.element('#send_gdpr')[0].disabled = false
                        angular.element('#send_gdpr')[0].textContent = $translate.instant('gdpr.send_email')
                        $scope.unprocessable_students =""
                    }, 3000);

                } else {
                    angular.element('#send_gdpr')[0].textContent = $translate.instant('gdpr.email_sent')

                    setTimeout(() => {
                        angular.element('#send_gdpr')[0].textContent = $translate.instant('gdpr.send_email')
                        angular.element('#send_gdpr')[0].disabled = false
                        $scope.unprocessable_students =""
                    }, 1000);
                }
            });
        }
    }]);


