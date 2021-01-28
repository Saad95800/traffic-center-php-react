<?php

namespace lib;

use \PDO;
use \Datetime;
use \lib\View;
use \lib\Model;
use \lib\Functions;

/**
 * Class Controller
 * @package core
 */
class Controller extends Model {

    /**
     * @var \core\View
     */
    public $_view;

    /**
     * @var \core\Functions
     */
    public $_functions;

    /**
     * @var Request
     */
    public $_Request;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        parent::__construct();

        $this->_view = new View();
    }

}
