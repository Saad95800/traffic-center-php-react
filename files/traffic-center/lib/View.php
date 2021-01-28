<?php

/**
 * View
 *
 * PHP version 7.0
 */

 namespace lib;

class View
{

    /**
     * Render a view file
     *
     * @param string $view  The view file
     * @param array $args  Associative array of data to display in the view (optional)
     *
     * @return void
     */
    public static function render($view, $args = [])
    {
        extract($args, EXTR_SKIP);

        $file = dirname(__DIR__) . "/template/$view";  // relative to Core directory

        if (is_readable($file)) {
            ob_start();
            require_once($file);
            return ob_get_clean();
        } else {
            throw new \Exception("$file not found");
        }
    }

}