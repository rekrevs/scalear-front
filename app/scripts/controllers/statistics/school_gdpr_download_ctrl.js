angular.module('scalearAngularApp')
    .controller('schoolGdprDownloadCtrl', ['$scope', '$rootScope', 'UserSession', 'User', 'Page', function ($scope, $rootScope, UserSession, User, Page) {

        Page.setTitle('GDPR');
        $rootScope.subheader_message = 'GDPR'
        var admin_email;
        $scope.email_sent = false;
        $scope.student_email = 'x';

        UserSession.getCurrentUser()
            .then(function (user) {
                admin_email = user.email
            })

        $scope.sendStudentsGdpr = function () {
            angular.element('#send_gdpr')[0].textContent = 'Checking out!'
            User.sendStudentActivityFile({
                admin_email: admin_email,
                student_email: $scope.student_email
            }, function (data) {
            
                setTimeout(() => {
                    angular.element('#send_gdpr')[0].textContent = 'send'
                }, 3000);
                $scope.student_email = "";
                
                if (data.not_found_students) {
                    $scope.unfound_accounts = data.not_found_students.toString();
                    angular.element('#send_gdpr')[0].textContent = 'send'
                    $scope.email_sent = true;       
                } else {
                    angular.element('#send_gdpr')[0].textContent = 'email sent'
                    $scope.email_sent = false;
                }
            });
        }
    }]);


