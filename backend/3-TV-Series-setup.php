<?php

$seriesData = [
    [
        'title' => 'Game of Thrones',
        'channel' => 'HBO',
        'gender' => 'Fantasy'
    ],
    [
        'title' => 'Breaking Bad',
        'channel' => 'AMC',
        'gender' => 'Crime Drama'
    ],
    [
        'title' => 'Stranger Things',
        'channel' => 'Netflix',
        'gender' => 'Science Fiction'
    ],
    [
        'title' => 'The Mandalorian',
        'channel' => 'Disney+',
        'gender' => 'Action Adventure'
    ],
    [
        'title' => 'The Crown',
        'channel' => 'Netflix',
        'gender' => 'Drama'
    ],
    [
        'title' => 'Friends',
        'channel' => 'NBC',
        'gender' => 'Sitcom'
    ],
    [
        'title' => 'The Office (US)',
        'channel' => 'NBC',
        'gender' => 'Mockumentary Sitcom'
    ],
    [
        'title' => 'Black Mirror',
        'channel' => 'Netflix',
        'gender' => 'Anthology Science Fiction'
    ],
    [
        'title' => 'The Witcher',
        'channel' => 'Netflix',
        'gender' => 'Fantasy'
    ],
    [
        'title' => 'The Falcon and the Winter Soldier',
        'channel' => 'Disney+',
        'gender' => 'Action Adventure'
    ],
    [
        'title' => 'Wandavision',
        'channel' => 'Disney+',
        'gender' => 'Superhero'
    ],
    [
        'title' => 'The Witcher: Blood Origin',
        'channel' => 'Netflix',
        'gender' => 'Fantasy'
    ],
    [
        'title' => 'Money Heist (La Casa de Papel)',
        'channel' => 'Netflix',
        'gender' => 'Crime Drama'
    ],
    [
        'title' => 'Narcos',
        'channel' => 'Netflix',
        'gender' => 'Crime Drama'
    ],
    [
        'title' => 'Stranger Things',
        'channel' => 'Netflix',
        'gender' => 'Science Fiction'
    ],
    [
        'title' => 'Breaking Bad',
        'channel' => 'AMC',
        'gender' => 'Crime Drama'
    ],
    [
        'title' => 'Better Call Saul',
        'channel' => 'AMC',
        'gender' => 'Crime Drama'
    ],
    [
        'title' => 'The Sopranos',
        'channel' => 'HBO',
        'gender' => 'Crime Drama'
    ],
    [
        'title' => 'The Wire',
        'channel' => 'HBO',
        'gender' => 'Crime Drama'
    ],
    [
        'title' => 'Fargo',
        'channel' => 'FX',
        'gender' => 'Crime Drama'
    ],
    [
        'title' => 'True Detective',
        'channel' => 'HBO',
        'gender' => 'Crime Drama'
    ],
    [
        'title' => 'Chernobyl',
        'channel' => 'HBO',
        'gender' => 'Drama'
    ],
    [
        'title' => 'The Mandalorian',
        'channel' => 'Disney+',
        'gender' => 'Action Adventure'
    ],
    [
        'title' => 'Westworld',
        'channel' => 'HBO',
        'gender' => 'Science Fiction'
    ],
    [
        'title' => 'Game of Thrones',
        'channel' => 'HBO',
        'gender' => 'Fantasy'
    ],
];


class TVSeries
{
    public $title;
    public $channel;
    public $gender;

    public function __construct($title, $channel, $gender)
    {
        $this->title = $title;
        $this->channel = $channel;
        $this->gender = $gender;
    }
}

class TVSeriesInterval
{
    public $id_tv_series;
    public $week_day;
    public $show_time;

    public function __construct($id_tv_series, $week_day, $show_time)
    {
        $this->id_tv_series = $id_tv_series;
        $this->week_day = $week_day;
        $this->show_time = $show_time;
    }
}

class TVSeriesManager
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function insertSeries(array $series)
    {
        $placeholders = implode(', ', array_fill(0, count($series), '(?, ?, ?)'));
        $stmt = $this->pdo->prepare("INSERT INTO exogroup.tv_series (title, channel, gender) VALUES $placeholders");

        $values = [];
        foreach ($series as $tvSeries) {
            $values = array_merge($values, [$tvSeries->title, $tvSeries->channel, $tvSeries->gender]);
        }

        $stmt->execute($values);

        // Obter o ID da última série inserida
        $lastInsertedSeriesId = $this->pdo->lastInsertId();

        // Retornar um array associativo com o ID e o nome da última série inserida
        $lastSeries = end($series);
        return $lastInsertedSeriesId;
    }

    public function insertIntervals(array $intervals)
    {
        $placeholders = implode(', ', array_fill(0, count($intervals), '(?, ?, ?)'));
        $stmt = $this->pdo->prepare("INSERT INTO exogroup.tv_series_intervals (id_tv_series, week_day, show_time) VALUES $placeholders");

        $values = [];
        foreach ($intervals as $tvInterval) {
            $values = array_merge($values, [$tvInterval->id_tv_series, $tvInterval->week_day, $tvInterval->show_time]);
        }

        //echo json_encode($values);

        $stmt->execute($values);
    }
}

try {
    // Configurações do banco de dados
    $hostname = 'localhost';
    $username = 'exogroup';
    $password = 'exogroup';
    $database = 'exogroup';
    $port = '9906';

    // Conectar ao banco de dados
    $pdo = new PDO("mysql:host=$hostname;port=$port;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $series = [];

    foreach ($seriesData as $data) {
        $series[] = new TVSeries($data['title'], $data['channel'], $data['gender']);
    }

    // Criação do gerenciador de séries
    $seriesManager = new TVSeriesManager($pdo);

    // Inserir séries no banco de dados
    $lastInsertedSeriesId = $seriesManager->insertSeries($series);

    // Dados dos intervalos
    $intervals = [];
    foreach ($series as $index => $tvSeries) {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        $selectedDays = array_rand($days, 3);

        foreach ($selectedDays as $day) {
            $showTime = gmdate("H:i:s", mt_rand(36000, 82800));
            $intervals[] = new TVSeriesInterval($lastInsertedSeriesId + ($index + 1), $days[$day], $showTime);
        }
    }

    // Inserir intervalos no banco de dados
    $seriesManager->insertIntervals($intervals);

    echo "Data inserted successfully.";
} catch (PDOException $e) {
    echo 'Error: ' . $e->getMessage();
}

?>