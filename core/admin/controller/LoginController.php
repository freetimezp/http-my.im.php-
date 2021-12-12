<?php

namespace core\admin\controller;

use core\base\model\UserModel;

class LoginController extends \core\base\controller\BaseController
{
    protected $model;

    protected function inputData() {
        $this->model = UserModel::instance();

        $a = 1;
    }
}