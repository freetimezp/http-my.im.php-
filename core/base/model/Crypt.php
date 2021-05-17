<?php

namespace core\base\model;

use core\base\controller\Singleton;

class Crypt
{
    use Singleton;

    private $cryptMethod = 'AES-128-CBC';
    private $hashAlgoritm = 'sha256';
    private $hashLength = 32;

    public function encrypt($str) {
        $ivlen = openssl_cipher_iv_length($this->cryptMethod);
        $iv = openssl_random_pseudo_bytes($ivlen);
        $cipherText = openssl_encrypt($str, $this->cryptMethod, CRYPT_KEY, OPENSSL_RAW_DATA, $iv);
        $hmac = hash_hmac($this->hashAlgoritm, $cipherText, CRYPT_KEY, true);

        //return base64_encode($iv . $hmac . $cipherText);

        $cipherText_comb = '112233445566778899';
        $iv_comb = 'abcdefg';
        $hmac_comb = '000000000000';

        $res = $this->cryptCombine($cipherText_comb, $iv_comb, $hmac_comb);
    }

    public function decrypt($str) {
        $crypt_str = base64_decode($str);
        $ivlen = openssl_cipher_iv_length($this->cryptMethod);
        $iv = substr($crypt_str, 0, $ivlen);
        $hmac = substr($crypt_str, $ivlen, $this->hashLength);
        $cipherText = substr($crypt_str, $ivlen + $this->hashLength);

        $original_plaintext = openssl_decrypt($cipherText, $this->cryptMethod, CRYPT_KEY, OPENSSL_RAW_DATA, $iv);
        $calcmac = hash_hmac($this->hashAlgoritm, $cipherText, CRYPT_KEY, true);

        if(hash_equals($hmac, $calcmac)) {
            return $original_plaintext;
        }

        return false;
    }

    protected function cryptCombine($str, $iv, $hmac) {
        $new_str = '';
        $str_len = strlen($str);
        $counter = (int)ceil(strlen(CRYPT_KEY) / ($str_len + strlen($hmac)));
        $progress = 1;

        if($counter >= $str_len) {
            $counter = 1;
        }

        for($i = 0; $i < $str_len; $i++) {
            if($counter < $str_len) {
                if($counter === $i) {
                    $new_str .= substr($iv, $progress - 1, 1);
                    $progress++;
                    $counter += $progress;
                }
            }else{
                break;
            }

            $new_str .= substr($str, $i, 1);
        }

        $new_str .= substr($str, $i);
        $new_str .= substr($iv, $progress - 1);

        $new_str_half = (int)ceil(strlen($new_str) / 2);

        $new_str = substr($new_str, 0, $new_str_half) . $hmac . substr($new_str, $new_str_half);

        return base64_encode($new_str);
    }
}