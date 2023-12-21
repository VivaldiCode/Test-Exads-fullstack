CREATE DATABASE IF NOT EXISTS exogroup;
USE exogroup;

-- Create tv_series table
CREATE TABLE IF NOT EXISTS exogroup.tv_series
(
    id      INT AUTO_INCREMENT PRIMARY KEY,
    title   VARCHAR(255) NOT NULL,
    channel VARCHAR(255) NOT NULL,
    gender  VARCHAR(255) NOT NULL
);

-- Create tv_series_intervals table
CREATE TABLE IF NOT EXISTS exogroup.tv_series_intervals
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    id_tv_series INT,
    week_day     VARCHAR(20) NOT NULL,
    show_time    TIME        NOT NULL
);
