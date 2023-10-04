use portfolio::Portfolio;

#[cfg(not(target_arch = "wasm32"))]
pub fn main() -> eframe::Result<()> {
    let options = eframe::NativeOptions::default();

    eframe::run_native(
        "Portfolio",
        options,
        Box::new(|cc| Box::new(Portfolio::new(cc))),
    )
}

#[cfg(target_arch = "wasm32")]
pub fn main() {
    // Redirect `log` message to `console.log` and friends:
    eframe::WebLogger::init(log::LevelFilter::Debug).ok();

    let web_options = eframe::WebOptions::default();

    wasm_bindgen_futures::spawn_local(async {
        eframe::WebRunner::new()
            .start(
                "canvas_id",
                web_options,
                Box::new(|cc| Box::new(Portfolio::new(cc))),
            )
            .await
            .expect("failed to start eframe");
    });
}
