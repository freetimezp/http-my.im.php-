<?php

defined('VG_ACCESS') or die('Access denied');

const MS_MODE = false;

const TEMPLATE = 'templates/default/';
const ADMIN_TEMPLATE = 'core/admin/view/';
const UPLOAD_DIR = 'userfiles/';

const COOKIE_VERSION = '1.0.0';
const CRYPT_KEY = 'nZr4u7w!z%C*F-JaThWmZq4t7w9z$C&FbPeShVmYq3t6w9y$G-KaPdSgVkYp3s6v%C*F-JaNdRgUkXp2w9z$C&F)J@NcRfUj3t6v9y$B&E)H@McQkYp3s5v8y/B?E(H+';
const COOKIE_TIME = 60;
const BLOCK_TIME = 3;

const QTY = 8;
const QTY_LINKS = 3;

const ADMIN_CSS_JS = [
  'styles' => ['css/main.css'],
  'scripts' => ['js/frameworkfunctions.js', 'js/scripts.js']
];

const USER_CSS_JS = [
    'styles' => [],
    'scripts' => []
];

use core\base\exceptions\RouteException;

function autoloadMainClasses($class_name) {
    $class_name = str_replace('\\', '/', $class_name);
    if (!@include_once $class_name . '.php') {
        throw new RouteException('Не верное имя файла для подключения: ' . $class_name);
    }
}

spl_autoload_register('autoloadMainClasses');







