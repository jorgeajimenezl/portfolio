use std::ops::Deref;

use eframe::{
    egui::{
        self, Button, CentralPanel, Context, FontData, FontDefinitions, Layout, RichText,
        TextStyle, TopBottomPanel, Visuals,
    },
    emath::Align,
    epaint::{FontFamily, FontId},
    App,
};

#[derive(Default)]
pub struct Portfolio;

impl App for Portfolio {
    fn update(&mut self, ctx: &Context, _frame: &mut eframe::Frame) {
        let dark_mode = ctx.style().visuals.dark_mode;

        TopBottomPanel::top("header").show(ctx, |ui| {
            egui::menu::bar(ui, |ui| {
                ui.add_space(5.0);
                ui.with_layout(Layout::right_to_left(Align::Center), |ui| {
                    if ui
                        .add(Button::new(
                            RichText::new(if dark_mode { "🔅" } else { "🌙" }).size(30.0),
                        ))
                        .clicked()
                    {
                        ctx.set_visuals(if dark_mode {
                            Visuals::light()
                        } else {
                            Visuals::dark()
                        });
                    }
                });
                ui.add_space(5.0);
            });
        });

        CentralPanel::default().show(ctx, |ui| {
            ui.vertical_centered(|ui| {
                ui.label(RichText::new("I'M JORGE ALEJANDRO JIMÉNEZ LUNA").size(32.0))
            });

            ui.label(format!("{}", ctx.style().visuals.dark_mode));
        });
    }
}

impl Portfolio {
    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        let obj = Self::default();
        obj.setup_fonts(&cc.egui_ctx);
        obj.setup_style(&cc.egui_ctx);

        obj
    }

    fn setup_style(&self, ctx: &Context) {
        let mut style = ctx.style().deref().clone();
        style.text_styles.insert(
            TextStyle::Heading,
            FontId::new(35.0, FontFamily::Proportional),
        );
        ctx.set_style(style);
    }

    fn setup_fonts(&self, ctx: &Context) {
        let mut fonts = FontDefinitions::default();
        fonts.font_data.insert(
            "MesloLGS".to_string(),
            FontData::from_static(include_bytes!("../MesloLGS_NF_Regular.ttf")),
        );

        fonts
            .families
            .entry(egui::FontFamily::Proportional)
            .or_default()
            .insert(0, "MesloLGS".to_string());
        fonts
            .families
            .entry(egui::FontFamily::Monospace)
            .or_default()
            .push("MesloLGS".to_string());

        ctx.set_fonts(fonts);
    }
}
