<?php

namespace core\user\controller;

use core\user\model\Model;

abstract class BaseUser extends \core\base\controller\BaseController
{
    protected $model;
    protected $table;

    protected function inputData() {
        $this->init();
        !$this->model && $this->model = Model::instance();
    }

    protected function outputData() {
        if(!$this->content) {
            $args = func_get_arg(0);
            $vars = $args ? $args : [];

            //if(!$this->template) { $this->template = ADMIN_TEMPLATE . 'show'; }

            $this->content = $this->render($this->template, $vars);
        }

        $this->header = $this->render(TEMPLATE . 'include/header', $vars);
        $this->footer = $this->render(TEMPLATE . 'include/footer', $vars);

        return $this->render(TEMPLATE . 'layout/default');
    }

    protected function img($img = '') {
        if(!$img && is_dir($_SERVER['DOCUMENT_ROOT'] . PATH . UPLOAD_DIR . DEFAULT_IMAGE_DIRECTORY)) {
            $dir = scandir($_SERVER['DOCUMENT_ROOT'] . PATH . UPLOAD_DIR . DEFAULT_IMAGE_DIRECTORY);

            $imgArr = preg_grep('/' . $this->getController() .'\./i', $dir) ?: preg_grep('/default\./i', $dir);

            $imgArr && $img = array_shift($imgArr);
        }

        return $img;
    }
}