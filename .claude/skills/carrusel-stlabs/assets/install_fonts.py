# -*- coding: utf-8 -*-
"""
Instala las fuentes de marca STLabs (empaquetadas en assets/fonts/) en las rutas
del sistema que espera stlabs_kit.py. Correr UNA VEZ al inicio de cada chat/build:

    python /ruta/a/la/skill/assets/install_fonts.py

No necesita red: las fuentes ya vienen dentro de la skill.
"""
import pathlib, shutil, subprocess

HERE = pathlib.Path(__file__).parent / "fonts"
STLABS = pathlib.Path("/usr/share/fonts/truetype/stlabs")
GFONTS = pathlib.Path("/usr/share/fonts/truetype/google-fonts")
IBMPLEX = pathlib.Path("/usr/share/fonts/truetype/ibm-plex")

MAPPING = {
    STLABS: [
        "BebasNeue-Regular.ttf",
        "BarlowCondensed-Regular.ttf", "BarlowCondensed-Medium.ttf",
        "BarlowCondensed-SemiBold.ttf", "BarlowCondensed-Bold.ttf",
        "BarlowCondensed-Black.ttf",
        # IBM Plex duplicado aquí porque stlabs_kit.py FONT_FACES apunta a /stlabs/
        "IBMPlexMono-Regular.ttf", "IBMPlexMono-Medium.ttf", "IBMPlexMono-SemiBold.ttf",
    ],
    GFONTS: ["Poppins-Bold.ttf", "Poppins-ExtraBold.ttf", "Lora-Italic-Variable.ttf"],
    IBMPLEX: ["IBMPlexMono-Regular.ttf", "IBMPlexMono-Medium.ttf", "IBMPlexMono-SemiBold.ttf"],
}

def main():
    for dest, files in MAPPING.items():
        dest.mkdir(parents=True, exist_ok=True)
        for f in files:
            src = HERE / f
            if src.exists():
                shutil.copy(src, dest / f)
            else:
                print(f"⚠ falta {src}")
    subprocess.run(["fc-cache", "-f"], capture_output=True)
    print("✓ Fuentes STLabs instaladas:",
          ", ".join(sorted({f for fs in MAPPING.values() for f in fs})))

if __name__ == "__main__":
    main()
