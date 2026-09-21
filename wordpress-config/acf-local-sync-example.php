<?php
/**
 * Contoh konfigurasi ACF Local JSON agar field otomatis tersinkron ke folder project WordPress.
 * Tempatkan file ini di functions.php tema WordPress Anda,
 * atau aktifkan sebagai mu-plugin bila ingin lebih aman.
 */

add_filter('acf/settings/save_json', function ($path) {
    $theme_dir = get_stylesheet_directory();
    $local_json_dir = $theme_dir . '/acf-json';

    if (!is_dir($local_json_dir)) {
        mkdir($local_json_dir, 0775, true);
    }

    return $local_json_dir;
});

add_filter('acf/settings/load_json', function ($paths) {
    $theme_dir = get_stylesheet_directory();
    $local_json_dir = $theme_dir . '/acf-json';

    if (is_dir($local_json_dir)) {
        $paths[] = $local_json_dir;
    }

    return array_unique($paths);
});

/**
 * Optional: aktifkan agar field group di ACF bisa tampil di GraphQL.
 */
add_filter('acf/settings/show_admin', '__return_true');
