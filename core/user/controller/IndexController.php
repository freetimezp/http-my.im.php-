<?php

namespace core\user\controller;

use core\admin\model\Model;
use core\base\controller\BaseController;

class IndexController extends BaseController {

    protected $name;

    protected function inputData() {
        $model = Model::instance();

        $res = $model->get('teachers', [
            'where' => ['id' => '42,43'],
            'operand' => ['IN'],
            'join' => [
                'stud_teach' => ['on' => ['id', 'teachers']],
                'students' => [
                    'fields' => ['id as student_id', 'name as student_name'],
                    'on' => ['students', 'id']
                ]
            ]
        ]);

        exit();
    }
}