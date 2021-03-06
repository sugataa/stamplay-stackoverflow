/*global angular*/
'use strict';

angular.module('stack', ['stack.service', 'infinite-scroll', 'ngRoute', 'ui.router', 'ui.bootstrap', 'textAngular', 'ngStamplay']);

angular
	.module('stack')
	.config(function ($stateProvider, $urlRouterProvider, $provide) {

		/* Textangular options, same options as StackOverflow */
		$provide.decorator('taOptions', ['$delegate',
			function (taOptions) {
				taOptions.toolbar =
					[
						['bold', 'italics'],
						['insertLink', 'quote', 'pre', 'insertImage'],
						['ol', 'ul'],
						['h1', 'h2'],
						['undo', 'redo'],
						['html']
					];
				return taOptions;
			}
		]);

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: '/pages/home.html',
				controller: 'homeCtrl',
				controllerAs: 'home'
			})
			.state('ask', {
				url: '/questions/ask',
				templateUrl: '/pages/ask.html',
				controller: 'askCtrl',
				controllerAs: 'askModel'
			})
			.state('questions', {
				url: '/questions/:id',
				templateUrl: '/pages/question.html',
				controller: 'answerCtrl',
				controllerAs: 'answer',
				resolve: {
					/* Populating the question with the related answers */
					question: function ($stateParams, questionsService) {
						return questionsService.getById($stateParams.id);
					}
				}
			})
			.state('tags', {
				url: '/tags',
				templateUrl: '/pages/tags.html',
				controller: 'tagsCtrl',
				controllerAs: 'tagsModel'
			})
			.state('users', {
				url: '/users',
				templateUrl: '/pages/users.html',
				controller: 'usersCtrl',
				controllerAs: 'usersModel',
				resolve: {
					/* Getting all users */
					users: function (usersService) {
						return usersService.getUsers();
					}
				}
			});
	})
	/* 
		Before starting the application we're saving the user if present in the rootScope
	*/
	.run(['$rootScope', 'userService',
		function ($rootScope, userService) {
			userService.getUserModel()
				.then(function (userResp) {
					$rootScope.user = userResp;
				});
		}

	]);