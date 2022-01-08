<?php

namespace core\user\controller;

use core\admin\model\Model;
use core\base\controller\BaseController;

class IndexController extends BaseUser {

    protected $name;

    protected function inputData()    {
        parent::inputData();

        $res = $this->img();

        $a = 1;
    }
}