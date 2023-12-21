<?php

class TVSeriesSchedule
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function getNextAiringTime($dateTime = null, $title = null)
    {
        if (!$dateTime) {
            $dateTime = new DateTime();
        }

        $formattedDateTime = $dateTime->format('Y-m-d H:i:s');
        $titleFilter = $title ? "AND ts.title = :title" : "";

        $query = "
            SELECT ts.title, tsi.week_day, tsi.show_time
            FROM tv_series ts
            JOIN tv_series_intervals tsi ON ts.id = tsi.id_tv_series
            WHERE CONCAT(tsi.week_day, ' ', tsi.show_time) > :current_time
            $titleFilter
            ORDER BY CONCAT(tsi.week_day, ' ', tsi.show_time) LIMIT 1
        ";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':current_time', $formattedDateTime, PDO::PARAM_STR);
        if ($title) {
            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
        }

        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            return "The next episode of '{$result['title']}' will air on {$result['week_day']} at {$result['show_time']}.";
        } else {
            return "No upcoming episodes found.";
        }
    }
}

// Usage example:
try {
    $db = new PDO('mysql:host=localhost;port=9906;dbname=exogroup', 'exogroup', 'exogroup');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $schedule = new TVSeriesSchedule($db);

    // Example 1: Get next airing time for all TV series
    $result = $schedule->getNextAiringTime();
    echo $result . PHP_EOL;

    // Example 2: Get next airing time for a specific TV series
    $result = $schedule->getNextAiringTime(new DateTime('2023-01-01 12:00:00'), 'Breaking Bad');
    echo $result . PHP_EOL;

} catch (PDOException $e) {
    echo 'Error: ' . $e->getMessage();
}

?>
