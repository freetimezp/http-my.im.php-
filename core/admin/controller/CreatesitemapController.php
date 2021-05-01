<?php

namespace core\admin\controller;

use core\base\controller\BaseMethods;

class CreatesitemapController extends BaseAdmin
{
    use BaseMethods;

    protected $linkArr = [];
    protected $parsingLogFile = 'parsing_log.txt';
    protected $fileArr = ['jpg', 'png', 'jpeg', 'gif', 'xls', 'xlsx', 'pdf', 'mp4', 'mpeg', 'mp3', 'avi'];
    protected $filterArr = [
        'url' => [],
        'get' => []
    ];

    protected function inputData() {
        if(!function_exists('curl_init')) {
            $this->writeLog('Отсутствует библиотека CURL');
            $_SESSION['res']['answer'] = '<div class="error">Library CURL is absent. Creation of sitemap is imposible.</div>';
            $this->redirect();
        }

        set_time_limit(0);

        if(file_exists($_SERVER['DOCUMENT_ROOT'] . PATH . 'log/' . $this->parsingLogFile)) {
            @unlink($_SERVER['DOCUMENT_ROOT'] . PATH . 'log/' . $this->parsingLogFile);
        }

        $this->parsing(SITE_URL);

        $this->createSitemap();

        !$_SESSION['res']['answer'] && $_SESSION['res']['answer'] = '<div class="success">Sitemap is created!</div>';

        $this->redirect();
    }

    protected function parsing($url, $index = 0) {
        if(mb_strlen(SITE_URL) + 1 === mb_strlen($url) &&
            mb_strrpos($url, '/') === mb_strlen($url) - 1) {
                return;
        }

        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HEADER, true);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl, CURLOPT_TIMEOUT, 120);
        curl_setopt($curl, CURLOPT_RANGE, 0 - 4194304);

        $out = curl_exec($curl);

        curl_close($curl);

        if(!preg_match("/Content=Type:\s+text\/html/ui", $out)) {
            unset($this->linkArr[$index]);

            $this->linkArr = array_values($this->linkArr);

            return;
        }

        if(!preg_match("/HTTP\/\d\.?\d?\s+20\d/uis", $out)) {
            $this->writeLog('Не корректная ссылка при парсинге - ' . $url, $this->parsingLogFile);

            unset($this->linkArr[$index]);

            $this->linkArr = array_values($this->linkArr);

            $_SESSION['res']['answer'] = '<div class="error">Incorrect link in parsing - ' . $url . ' <br>Sitemap is created.</div>';

            return;
        }

    }

    protected function filter($link) {

    }

    protected function createSitemap() {

    }
}