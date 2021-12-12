<?php

namespace core\admin\controller;

use core\base\model\UserModel;
use core\base\settings\Settings;

class LoginController extends \core\base\controller\BaseController
{
    protected $model;

    protected function inputData() {
        $this->model = UserModel::instance();

        if($this->isPost()) {
            $a = 1;
        }

        return $this->render('', ['adminPath' => Settings::get('routes')['admin']['alias']]);
    }
}