'use strict';

angular.module('scalearAngularApp')
.factory('Saml', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope', '$translate',function($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/saml/:action', {lang:$translate.uses()},
      { 
      	'Login': { method: 'GET', params: {action: 'saml_signin'}, headers: headers },
      });

}])
.factory('SWAMID',function(){
	return {
		list:function(){
			return  [
					  {
					    "description": {
					      "sv": "NORDUnet A/S Identitetsutfärdare används av anställda och gäster vid NORDUnet",
					      "en": "The NORDUnet A/S Identity Provider is used by employees and guests of NORDUnet."
					    },
					    "logo": {
					      "all": {
					        "url": "https://www.nordu.net/resources/NORDUnet2.jpg",
					        "height": "46",
					        "width": "203"
					      },
					      "sv": {
					        "url": "https://www.nordu.net/resources/NORDUnet2.jpg",
					        "height": "46",
					        "width": "203"
					      },
					      "en": {
					        "url": "https://www.nordu.net/resources/NORDUnet2.jpg",
					        "height": "46",
					        "width": "203"
					      }
					    },
					    "displayName": {
					      "sv": "NORDUnet",
					      "en": "NORDUnet"
					    },
					    "name": {},
					    "url": {
					      "en": "http://www.nordu.net"
					    },
					    "entityID": "https://idp.nordu.net/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för anställda och studenter vid Högskolan i Gävle.",
					      "en": "The University of Gävle Identity Provider is used by employees and students at the university."
					    },
					    "logo": {
					      "all": {
					        "url": "https://webkonto.student.hig.se/head/loggaengelska.png",
					        "height": "94",
					        "width": "83"
					      },
					      "sv": {
					        "url": "https://webkonto.student.hig.se/head/logga3.png",
					        "height": "94",
					        "width": "83"
					      },
					      "en": {
					        "url": "https://webkonto.student.hig.se/head/loggaengelska.png",
					        "height": "94",
					        "width": "83"
					      }
					    },
					    "displayName": {
					      "sv": "Högskolan i Gävle",
					      "en": "University of Gävle"
					    },
					    "name": {
					      "en": "HIG"
					    },
					    "url": {
					      "en": "http://www.hig.se"
					    },
					    "entityID": "https://idp.hig.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för alumni vid Högskolan i Gävle.",
					      "en": "The University of Gävle Identity Provider is used by alumni at the university."
					    },
					    "logo": {
					      "all": {
					        "url": "https://webkonto.student.hig.se/head/loggaengelska.png",
					        "height": "94",
					        "width": "83"
					      },
					      "sv": {
					        "url": "https://webkonto.student.hig.se/head/logga3.png",
					        "height": "94",
					        "width": "83"
					      },
					      "en": {
					        "url": "https://webkonto.student.hig.se/head/loggaengelska.png",
					        "height": "94",
					        "width": "83"
					      }
					    },
					    "displayName": {
					      "sv": "Högskolan i Gävle (Alumni)",
					      "en": "University of Gävle (Alumni)"
					    },
					    "name": {
					      "en": "HIGALUMNI"
					    },
					    "url": {
					      "en": "http://www.hig.se"
					    },
					    "entityID": "https://idp2.hig.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för anställda och studenter vid Linnéuniversitetet.",
					      "en": "The Linnæus University Identity Provider is used by employees and students at the university."
					    },
					    "logo": {},
					    "displayName": {
					      "sv": "Linnéuniversitetet",
					      "en": "Linnæus University"
					    },
					    "name": {
					      "en": "LNU"
					    },
					    "url": {
					      "en": "http://www.lnu.se"
					    },
					    "entityID": "https://idp.lnu.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för anställda och studenter vid Högskolan Dalarna.",
					      "en": "Identity Provider for employees and students at Dalarna University."
					    },
					    "logo": {
					      "all": {
					        "url": "https://login.du.se/duse-logo-16x16.png",
					        "height": "16",
					        "width": "16"
					      },
					      "sv": {
					        "url": "https://login.du.se/duse-logo-sv.png",
					        "height": "350",
					        "width": "146"
					      },
					      "en": {
					        "url": "https://login.du.se/duse-logo-en.png",
					        "height": "350",
					        "width": "146"
					      }
					    },
					    "displayName": {
					      "sv": "Högskolan Dalarna",
					      "en": "Dalarna University"
					    },
					    "name": {
					      "en": "DU"
					    },
					    "url": {
					      "en": "http://www.du.se"
					    },
					    "entityID": "https://login.du.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Malmö högskola",
					      "en": "Identity Provider for Malmö University"
					    },
					    "logo": {
					      "all": {
					        "url": "http://cdn.mah.se/images/header/en/logo_en.jpg",
					        "height": "195",
					        "width": "132"
					      },
					      "sv": {
					        "url": "http://cdn.mah.se/images/header/sv/logo_sv.jpg",
					        "height": "195",
					        "width": "132"
					      },
					      "en": {
					        "url": "http://cdn.mah.se/images/header/en/logo_en.jpg",
					        "height": "195",
					        "width": "132"
					      }
					    },
					    "displayName": {
					      "sv": "Malmö högskola",
					      "en": "Malmö University"
					    },
					    "name": {
					      "en": "MAH"
					    },
					    "url": {
					      "en": "http://www.mah.se"
					    },
					    "entityID": "https://idp.mah.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Sveriges Lantbruksuniversitet.",
					      "en": "Identity Provider for Swedish University of Agricultural Science"
					    },
					    "logo": {
					      "undefined": {
					        "url": "https://idp2-1.slu.se/info/images/slu_logotyp_web_16.png",
					        "height": "16",
					        "width": "16"
					      }
					    },
					    "displayName": {
					      "sv": "Sveriges Lantbruksuniversitet",
					      "en": "Swedish University of Agricultural Science"
					    },
					    "name": {
					      "en": "Swedish University of Agricultural Science"
					    },
					    "url": {
					      "en": "http://www.slu.se/en/"
					    },
					    "entityID": "https://idp2-1.slu.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identitsutgivare för anställda och studenter vid Linköpings universitet.",
					      "en": "Identity Provider for employees and students at Linköping University."
					    },
					    "logo": {
					      "all": {
					        "url": "https://login.liu.se/idp/images/logo-350x68-sv.png",
					        "height": "68",
					        "width": "350"
					      },
					      "sv": {
					        "url": "https://login.liu.se/idp/images/logo-350x68-sv.png",
					        "height": "68",
					        "width": "350"
					      },
					      "en": {
					        "url": "https://login.liu.se/idp/images/logo-350x68-en.png",
					        "height": "68",
					        "width": "350"
					      }
					    },
					    "displayName": {
					      "sv": "Linköpings Universitet",
					      "en": "Linköping University"
					    },
					    "name": {
					      "sv": "LiU",
					      "en": "LiU"
					    },
					    "url": {
					      "sv": "http://www.liu.se?l=sv",
					      "en": "http://www.liu.se?l=en"
					    },
					    "entityID": "https://login.liu.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Luleå tekniska universitet",
					      "en": "Identity Provider for Lulea University of Technology"
					    },
					    "logo": {},
					    "displayName": {
					      "sv": "Luleå tekniska universitet",
					      "en": "Lulea University of Technology"
					    },
					    "name": {
					      "en": "LTU"
					    },
					    "url": {
					      "en": "http://www.ltu.se"
					    },
					    "entityID": "https://shibbo.ltu.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Inloggning i webbtjänster för anställda och studenter vid Högskolan Kristianstad.",
					      "en": "The Kristianstad University Login Service is used by employees and students at the university."
					    },
					    "logo": {
					      "sv": {
					        "url": "https://idp.hkr.se/idp/images/hkrsmall.png",
					        "height": "84",
					        "width": "96"
					      },
					      "en": {
					        "url": "https://idp.hkr.se/idp/images/hkrsmall.png",
					        "height": "84",
					        "width": "96"
					      }
					    },
					    "displayName": {
					      "sv": "Högskolan Kristianstad",
					      "en": "Kristianstad University Sweden"
					    },
					    "name": {
					      "en": "HKR"
					    },
					    "url": {
					      "sv": "http://www.hkr.se",
					      "en": "http://www.hkr.se/en/english-start-page/"
					    },
					    "entityID": "https://idp.hkr.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för medarbetare och studenter vid Stockholms universitet.",
					      "en": "The Stockholm university Identity Provider is used by employees and students at the university."
					    },
					    "logo": {
					      "sv": {
					        "url": "https://idp.it.su.se/idp/img/su-logo-sv_OLD.gif",
					        "height": "110",
					        "width": "127"
					      },
					      "en": {
					        "url": "https://idp.it.su.se/idp/img/su-logo-en_OLD.gif",
					        "height": "110",
					        "width": "127"
					      }
					    },
					    "displayName": {
					      "sv": "Stockholms universitet",
					      "en": "Stockholm University"
					    },
					    "name": {
					      "en": "SU"
					    },
					    "url": {
					      "en": "http://www.su.se"
					    },
					    "entityID": "https://idp.it.su.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Örebro universitet",
					      "en": "Örebro University Identity Provider"
					    },
					    "logo": {
					      "all": {
					        "url": "https://cas-01.oru.se/cas/Logo_txt_runt_farg.gif",
					        "height": "65",
					        "width": "90"
					      }
					    },
					    "displayName": {
					      "sv": "Örebro universitet",
					      "en": "Örebro University"
					    },
					    "name": {
					      "en": "ORU"
					    },
					    "url": {
					      "en": "http://www.oru.se"
					    },
					    "entityID": "https://shib-idp-1.oru.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Karlstads universitet",
					      "en": "Identity Provider for Karlstad University"
					    },
					    "logo": {
					      "all": {
					        "url": "https://www.kau.se/sites/all/themes/kau/logo.png",
					        "height": "112",
					        "width": "112"
					      },
					      "sv": {
					        "url": "https://www.kau.se/sites/all/themes/kau/logo.png",
					        "height": "112",
					        "width": "112"
					      },
					      "en": {
					        "url": "https://www.kau.se/sites/all/themes/kau/logo.png",
					        "height": "112",
					        "width": "112"
					      }
					    },
					    "displayName": {
					      "sv": "Karlstads universitet",
					      "en": "Karlstad University"
					    },
					    "name": {
					      "en": "KAU"
					    },
					    "url": {
					      "en": "http://www.kau.se"
					    },
					    "entityID": "https://idp2.kau.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för anställda och studenter vid Högskolan i Jönköping.",
					      "en": "The Jönköping University Identity Provider is used by employees and students at the university."
					    },
					    "logo": {
					      "sv": {
					        "url": "https://shibb1.hj.se/idp/images/logo.png",
					        "height": "84",
					        "width": "749"
					      },
					      "en": {
					        "url": "https://shibb1.hj.se/idp/images/logo.png",
					        "height": "84",
					        "width": "749"
					      }
					    },
					    "displayName": {
					      "sv": "Högskolan i Jönköping",
					      "en": "Jönköping University"
					    },
					    "name": {
					      "en": "HJ"
					    },
					    "url": {
					      "en": "http://www.hj.se"
					    },
					    "entityID": "https://shibb1.hj.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Kungliga biblioteket.",
					      "en": "Identity Provider for the National Library of Sweden."
					    },
					    "logo": {
					      "all": {
					        "url": "https://idp.kb.se/idp/images/logga_FB.gif",
					        "height": "488",
					        "width": "516"
					      }
					    },
					    "displayName": {
					      "sv": "Kungliga biblioteket",
					      "en": "National Library of Sweden"
					    },
					    "name": {
					      "en": "KB"
					    },
					    "url": {
					      "en": "http://www.kb.se"
					    },
					    "entityID": "https://idp.kb.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för anställda och studenter hos Mittuniversitetet",
					      "en": "Mid Sweden University Identity Provider, used by employees and students at Mid Sweden University"
					    },
					    "logo": {
					      "sv": {
					        "url": "https://www.miun.se/imagevault/publishedmedia/x4bl7padufcm1j4td3d7/logo.png",
					        "height": "111",
					        "width": "225"
					      },
					      "en": {
					        "url": "https://www.miun.se/imagevault/publishedmedia/x4bl7padufcm1j4td3d7/logo.png",
					        "height": "111",
					        "width": "225"
					      }
					    },
					    "displayName": {
					      "sv": "Mittuniversitetet",
					      "en": "Mid Sweden University"
					    },
					    "name": {
					      "en": "MIUN"
					    },
					    "url": {
					      "en": "http://www.miun.se"
					    },
					    "entityID": "https://vmidgw3.miun.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Institutet för rymdfysik",
					      "en": "Identity Provider for the Swedish Institute of Space Physics"
					    },
					    "logo": {
					      "all": {
					        "url": "https://www.irf.se/image/IRF_logo.png",
					        "height": "145",
					        "width": "144"
					      },
					      "sv": {
					        "url": "https://www.irf.se/image/IRF_logo.png",
					        "height": "145",
					        "width": "144"
					      },
					      "en": {
					        "url": "https://www.irf.se/image/IRF_logo.png",
					        "height": "145",
					        "width": "144"
					      }
					    },
					    "displayName": {
					      "sv": "Institutet för rymdfysik",
					      "en": "Swedish Institute of Space Physics"
					    },
					    "name": {
					      "en": "IRF"
					    },
					    "url": {
					      "en": "http://www.irf.se"
					    },
					    "entityID": "https://idp.irf.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Högskolan i Halmstad",
					      "en": "Identity Provider for Halmstad University"
					    },
					    "logo": {
					      "all": {
					        "url": "https://signon.hh.se/hh-logo-en-350x116.png",
					        "height": "116",
					        "width": "350"
					      },
					      "sv": {
					        "url": "https://signon.hh.se/hh-logo-sv-350x116.png",
					        "height": "116",
					        "width": "350"
					      },
					      "en": {
					        "url": "https://signon.hh.se/hh-logo-en-350x116.png",
					        "height": "116",
					        "width": "350"
					      }
					    },
					    "displayName": {
					      "sv": "Högskolan i Halmstad",
					      "en": "Halmstad University"
					    },
					    "name": {
					      "en": "HH"
					    },
					    "url": {
					      "en": "http://www.hh.se"
					    },
					    "entityID": "https://signon.hh.se/idp/shibboleth"
					  },
					  {
					    "displayName": {
					      "sv": "Vetenskapsrådet",
					      "en": "Vetenskapsrådet"
					    },
					    "name": {
					      "en": "VR"
					    },
					    "url": {
					      "en": "http://www.vr.se"
					    },
					    "entityID": "https://livesrv.ex.vr.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Blekinge Tekniska Högskola för personal",
					      "en": "Identity Provider for Blekinge Institute of Technology for personnel"
					    },
					    "logo": {},
					    "displayName": {
					      "sv": "Blekinge Tekniska Högskola - Personal",
					      "en": "Blekinge Institute of Technology - Personnel"
					    },
					    "name": {
					      "en": "BTH"
					    },
					    "url": {
					      "en": "http://www.bth.se"
					    },
					    "entityID": "https://idp.bth.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Blekinge Tekniska Högskola för studenter",
					      "en": "Identity Provider for Blekinge Institute of Technology for students"
					    },
					    "logo": {},
					    "displayName": {
					      "sv": "Blekinge Tekniska Högskola - Studenter",
					      "en": "Blekinge Institute of Technology - Students"
					    },
					    "name": {
					      "en": "STUDENTS-BTH"
					    },
					    "url": {
					      "en": "http://www.bth.se"
					    },
					    "entityID": "https://idp.student.bth.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för anställda och studenter vid Mälardalens högskola.",
					      "en": "The Mälardalen University Identity Provider is used by employees and students at the university."
					    },
					    "logo": {
					      "all": {
					        "url": "https://identity.mdh.se/img/logo-sv.png",
					        "height": "117",
					        "width": "216"
					      },
					      "sv": {
					        "url": "https://identity.mdh.se/img/logo-sv.png",
					        "height": "117",
					        "width": "216"
					      },
					      "en": {
					        "url": "https://identity.mdh.se/img/logo-en.png",
					        "height": "117",
					        "width": "216"
					      }
					    },
					    "displayName": {
					      "sv": "Mälardalens Högskola",
					      "en": "Mälardalen University"
					    },
					    "name": {
					      "en": "MDH"
					    },
					    "url": {
					      "en": "http://www.mdh.se"
					    },
					    "entityID": "https://identity.mdh.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för anställda och studenter vid Göteborgs universitet.",
					      "en": "The University of Gothenburg Identity Provider is used by employees and students at the university."
					    },
					    "logo": {
					      "sv": {
					        "url": "https://www.gu.se/digitalAssets/1374/1374690_lo_gu_left.png",
					        "height": "50",
					        "width": "344"
					      },
					      "en": {
					        "url": "https://www.gu.se/digitalAssets/1374/1374690_lo_gu_left.png",
					        "height": "50",
					        "width": "376"
					      }
					    },
					    "displayName": {
					      "sv": "Göteborgs Universitet",
					      "en": "University of Gothenburg"
					    },
					    "name": {
					      "en": "GU"
					    },
					    "url": {
					      "en": "http://www.gu.se"
					    },
					    "entityID": "https://idp.it.gu.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "University College of Arts, Crafts and Design",
					      "en": "University College of Arts, Crafts and Design"
					    },
					    "logo": {
					      "all": {
					        "url": "https://idp.konstfack.se/idp/images/logo.jpg",
					        "height": "142",
					        "width": "142"
					      },
					      "sv": {
					        "url": "https://idp.konstfack.se/idp/images/logo.jpg",
					        "height": "142",
					        "width": "142"
					      },
					      "en": {
					        "url": "https://idp.konstfack.se/idp/images/logo.jpg",
					        "height": "142",
					        "width": "142"
					      }
					    },
					    "displayName": {
					      "sv": "Konstfack",
					      "en": "Konstfack"
					    },
					    "name": {
					      "en": "Konstfack"
					    },
					    "url": {
					      "en": "http://www.konstfack.se"
					    },
					    "entityID": "https://idp.konstfack.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Röda Korsets Högskola",
					      "en": "Identity Provider for Swedish Red Cross University College"
					    },
					    "logo": {
					      "sv": {
					        "url": "http://www.rkh.se/images/logo.png",
					        "height": "90",
					        "width": "165"
					      },
					      "en": {
					        "url": "http://www.rkh.se/images/logo.png",
					        "height": "90",
					        "width": "165"
					      }
					    },
					    "displayName": {
					      "sv": "Röda Korsets Högskola",
					      "en": "Swedish Red Cross University College"
					    },
					    "name": {
					      "en": "The Red Cross University College"
					    },
					    "url": {
					      "en": "http://www.rkh.se"
					    },
					    "entityID": "https://idp.rkh.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Kungliga Musikhögskolan",
					      "en": "Identity Provider for Royal College of Music"
					    },
					    "logo": {
					      "sv": {
					        "url": "https://idp.kmh.se/idp/images/logo.jpg",
					        "height": "141",
					        "width": "313"
					      },
					      "en": {
					        "url": "https://idp.kmh.se/idp/images/logo.jpg",
					        "height": "141",
					        "width": "313"
					      }
					    },
					    "displayName": {
					      "sv": "Kungliga Musikhögskolan i Stockholm",
					      "en": "Royal College of Music"
					    },
					    "name": {
					      "en": "KMH"
					    },
					    "url": {
					      "en": "http://www.kmh.se"
					    },
					    "entityID": "https://idp.kmh.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identitetstjänst för anställda och studenter vid Lunds universitet",
					      "en": "Identity Provider for employees and students at Lund University"
					    },
					    "logo": {
					      "sv": {
					        "url": "http://www2.ldc.lu.se/images/LU_swe_logo_450px.jpg",
					        "height": "78",
					        "width": "450"
					      },
					      "en": {
					        "url": "http://www2.ldc.lu.se/images/LU_eng_logo_382px.jpg",
					        "height": "78",
					        "width": "382"
					      }
					    },
					    "displayName": {
					      "sv": "Lunds universitet",
					      "en": "Lund University"
					    },
					    "name": {
					      "en": "LU"
					    },
					    "url": {
					      "en": "http://www.lu.se/"
					    },
					    "entityID": "https://idp.lu.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Kungliga Vetenskapsakademien",
					      "en": "Identity Provider for the Royal Swedish Academy of Sciences"
					    },
					    "logo": {
					      "all": {
					        "url": "https://idp.kva.se/idp/images/headerLogo.gif",
					        "height": "78",
					        "width": "179"
					      }
					    },
					    "displayName": {
					      "sv": "Kungliga Vetenskapsakademien",
					      "en": "The Royal Swedish Academy of Sciences"
					    },
					    "name": {
					      "en": "KVA"
					    },
					    "url": {
					      "en": "http://www.kva.se"
					    },
					    "entityID": "https://idp.kva.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Ersta Sköndal University College",
					      "en": "Identity Provider for the Royal Swedish Academy of Sciences"
					    },
					    "logo": {},
					    "displayName": {
					      "sv": "Ersta Sköndal Högskola",
					      "en": "Ersta Sköndal University College"
					    },
					    "name": {
					      "sv": "Ersta Sköndal Högskola"
					    },
					    "url": {
					      "sv": "http://www.esh.se/"
					    },
					    "entityID": "https://idp.esh.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Karolinska Institutet.",
					      "en": "Identity Provider for Karolinska Institutet."
					    },
					    "logo": {
					      "all": {
					        "url": "https://kiidp.ki.se/images/ki_logo_292x146.png",
					        "height": "146",
					        "width": "292"
					      }
					    },
					    "displayName": {
					      "sv": "Karolinska Institutet",
					      "en": "Karolinska Institutet"
					    },
					    "name": {
					      "en": "KI"
					    },
					    "url": {
					      "en": "http://www.ki.se"
					    },
					    "entityID": "https://kiidp.ki.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Sophiahemmet Högskola.",
					      "en": "Identity Provider for Sophiahemmet University."
					    },
					    "logo": {
					      "all": {
					        "url": "https://swamid2.shh.se/idp/images/shh_logo.png",
					        "height": "122",
					        "width": "350"
					      },
					      "sv": {
					        "url": "https://swamid2.shh.se/idp/images/shh_logo.png",
					        "height": "122",
					        "width": "350"
					      },
					      "en": {
					        "url": "https://swamid2.shh.se/idp/images/shh_logo.png",
					        "height": "122",
					        "width": "350"
					      }
					    },
					    "displayName": {
					      "sv": "Sophiahemmet Högskola",
					      "en": "Sophiahemmet University"
					    },
					    "name": {
					      "en": "SHH"
					    },
					    "url": {
					      "en": "http://www.shh.se"
					    },
					    "entityID": "https://swamid2.shh.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för anställda och studenter vid Högskolan i Borås.",
					      "en": "Identity Provider for employees and students at Borås University."
					    },
					    "logo": {
					      "undefined": {
					        "url": "https://www.hb.se//PageFiles/41206/HBloggaSwamid.gif",
					        "height": "90",
					        "width": "350"
					      },
					      "sv": {
					        "url": "https://www.hb.se//PageFiles/41206/HBloggaSwamid.gif",
					        "height": "90",
					        "width": "350"
					      }
					    },
					    "displayName": {
					      "sv": "Högskolan i Borås",
					      "en": "University of Borås"
					    },
					    "name": {
					      "en": "HB"
					    },
					    "url": {
					      "en": "http://www.hb.se"
					    },
					    "entityID": "https://hbidp.hb.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Högskolan i Skövde",
					      "en": "Identity Provider for University of Skövde"
					    },
					    "logo": {
					      "all": {
					        "url": "https://idp.his.se/his_eng_rubin.png",
					        "height": "196",
					        "width": "193"
					      },
					      "sv": {
					        "url": "https://idp.his.se/his_se_rubin.png",
					        "height": "196",
					        "width": "206"
					      },
					      "en": {
					        "url": "https://idp.his.se/his_eng_rubin.png",
					        "height": "196",
					        "width": "193"
					      }
					    },
					    "displayName": {
					      "sv": "Högskolan i Skövde",
					      "en": "University of Skövde"
					    },
					    "name": {
					      "en": "HIS"
					    },
					    "url": {
					      "en": "http://www.his.se"
					    },
					    "entityID": "https://idp.his.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Högskolan Väst",
					      "en": "Identity Provider for University West"
					    },
					    "logo": {
					      "sv": {
					        "url": "http://www.hv.se/Media/Get/17595/svensk-logotyp-200x103",
					        "height": "103",
					        "width": "200"
					      },
					      "en": {
					        "url": "http://www.hv.se/Media/Get/17597/3.-engelsk-logga.jpg",
					        "height": "103",
					        "width": "200"
					      }
					    },
					    "displayName": {
					      "sv": "Högskolan Väst",
					      "en": "University West"
					    },
					    "name": {
					      "sv": "HV",
					      "en": "HV"
					    },
					    "url": {
					      "sv": "http://www.hv.se",
					      "en": "http://www.hv.se"
					    },
					    "entityID": "https://idp2.hv.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identitetsutgivare för Gymnastik- och Idrottshögskolan vid Stockholms Stadion",
					      "en": "Identity Provider for The Swedish School of Sport and Health Sciences"
					    },
					    "logo": {
					      "all": {
					        "url": "https://gihidentity01.ihs.se/idp/images/gihlogo.gif",
					        "height": "107",
					        "width": "204"
					      }
					    },
					    "displayName": {
					      "sv": "Gymnastik- och idrottshögskolan",
					      "en": "The Swedish School of Sport and Health Sciences"
					    },
					    "name": {
					      "en": "The Swedish School of sport and health sciences"
					    },
					    "url": {
					      "en": "http://www.gih.se"
					    },
					    "entityID": "https://gihidentity01.ihs.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Gemensam webbinloggning för anställda, studenter och övriga verksamma vid Uppsala universitet.",
					      "en": "The Uppsala University Identity Provider is used by employees and students at the university."
					    },
					    "logo": {
					      "all": {
					        "url": "https://weblogin.uu.se/idp/UUlogin/img/logga-50.png",
					        "height": "50",
					        "width": "50"
					      },
					      "sv": {
					        "url": "https://weblogin.uu.se/idp/UUlogin/img/logga-50.png",
					        "height": "50",
					        "width": "50"
					      },
					      "en": {
					        "url": "https://weblogin.uu.se/idp/UUlogin/img/logga-50.png",
					        "height": "50",
					        "width": "50"
					      }
					    },
					    "displayName": {
					      "sv": "Uppsala universitet",
					      "en": "Uppsala University"
					    },
					    "name": {
					      "en": "UU"
					    },
					    "url": {
					      "en": "http://www.uu.se"
					    },
					    "entityID": "https://weblogin.uu.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Handelshögskolan i Stockholm.",
					      "en": "Identity Provider for Stockholm School of Economics."
					    },
					    "logo": {
					      "all": {
					        "url": "https://login.idp.hhs.se/idp/images/logo.png",
					        "height": "82",
					        "width": "82"
					      }
					    },
					    "displayName": {
					      "sv": "Handelshögskolan i Stockholm",
					      "en": "Stockholm School of Economics"
					    },
					    "name": {
					      "en": "HHS"
					    },
					    "url": {
					      "en": "http://www.hhs.se"
					    },
					    "entityID": "https://login.idp.hhs.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för KTH",
					      "en": "Identity Provider for KTH"
					    },
					    "logo": {
					      "all": {
					        "url": "https://saml.sys.kth.se/idp/images/logo.png",
					        "height": "166",
					        "width": "166"
					      }
					    },
					    "displayName": {
					      "sv": "Kungliga Tekniska högskolan (KTH)",
					      "en": "KTH Royal Institute of Technology"
					    },
					    "name": {
					      "en": "KTH"
					    },
					    "url": {
					      "en": "http://www.kth.se"
					    },
					    "entityID": "https://saml.sys.kth.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "en": "Identity Provider for SICS",
					      "sv": "Identity Provider för SICS"
					    },
					    "logo": {
					      "all": {
					        "url": "https://www.sics.se/logo.png",
					        "height": "95",
					        "width": "328"
					      }
					    },
					    "displayName": {
					      "en": "SICS",
					      "sv": "SICS"
					    },
					    "name": {
					      "en": "SICS"
					    },
					    "url": {
					      "en": "https://www.sics.se"
					    },
					    "entityID": "https://idp.sics.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Kungl. Konsthögskolan (KKH)",
					      "en": "Identity Provider for the Royal Institute of Art (KKH)"
					    },
					    "logo": {
					      "all": {
					        "url": "https://idp.kkh.se/idp/images/kkh.png",
					        "height": "110",
					        "width": "404"
					      }
					    },
					    "displayName": {
					      "sv": "Kungl. Konsthögskolan",
					      "en": "Royal Institute of Art"
					    },
					    "name": {
					      "en": "KKH"
					    },
					    "url": {
					      "en": "http://www.kkh.se"
					    },
					    "entityID": "https://idp.kkh.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Karolinska Institutet.",
					      "en": "Identity Provider for Karolinska Institutet."
					    },
					    "logo": {
					      "all": {
					        "url": "https://login.ki.se/images/ki_logo_292x146.png",
					        "height": "146",
					        "width": "292"
					      }
					    },
					    "displayName": {
					      "en": "Karolinska Institutet"
					    },
					    "name": {
					      "en": "KI"
					    },
					    "url": {
					      "en": "http://www.ki.se"
					    },
					    "entityID": "https://login.ki.se/idp/shibboleth"
					  },
					  {
					    "description": {
					      "sv": "Identity Provider för Teologiska högskolan Stockholm",
					      "en": "Identity Provider for Stockholm School of Theology"
					    },
					    "displayName": {
					        "sv": "Teologiska högskolan Stockholm",
					        "en": "Stockholm School of Theology",
					    },
					    "logo": {
					      "all": {
					        "url": "http://idp.ths.se/idp/images/ths.png",
					        "height": "100",
					        "width": "100"
					      }
					    },
					    "entityID": "https://idp.ths.se/idp/shibboleth"
					  }
			]
		}
	}
});
