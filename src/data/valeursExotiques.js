/* Valeurs de référence des espèces exotiques.
   Fichier généré à partir des tableaux transcrits du Graham et al. (2021) :
   9.1 (hématocrite, protéines), 9.4 (glycémie), 9.5 (lactate), 9.6 et 9.7
   (température, fréquences), 11.5 (biochimie rénale), 11.9 et 12.1 (urine).
   Retirés en attendant une deuxième source : le phosphore du lapin (même
   valeur que la créatinine dans le livre) et la fréquence respiratoire du
   rat (une seule valeur au lieu d'un intervalle).
   Une espèce peut regrouper plusieurs sujets (rongeurs : rat, souris,
   hamster, gerbille). */
export const VALEURS_EXOTIQUES = {
  "lapin": [
    {
      "nom": "Lapin",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "38,5–39,5 (101,3–103,1)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "200–300"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "32–60"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "34–43"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,0–7,5"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "74–148",
              "detail": "soit 4,1–8,2 mmol/L"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "6,9 ± 2,7",
              "detail": "analyseur portable"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "7,1 ± 1,6",
              "detail": "analyseur de gaz sanguins"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "13–29"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,5–2,5"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "5,6–12,5"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,003–1,036"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "mg/dL",
              "valeur": "Traces"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "8,2–8,8"
            },
            {
              "nom": "Volume urinaire",
              "unite": "mL/24 h",
              "valeur": "130 par kg"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Rouge, orange, brune ou jaune clair ; blanche trouble et turbide"
            }
          ]
        }
      ]
    }
  ],
  "furet": [
    {
      "nom": "Furet",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "37,8–40,0 (100,0–104,0)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "200–400"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "33–36"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "47–59"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,0–6,8"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "99–135",
              "detail": "soit 5,5–7,5 mmol/L"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "0,3–1,5",
              "detail": "analyseur portable"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "10–45"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,4–0,9"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "4,0–9,1"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "8,0–11,8"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "Mâles 1,034–1,070 ; femelles 1,026–1,060"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "mg/dL",
              "valeur": "0–33"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "6,5–7,5"
            },
            {
              "nom": "Volume urinaire",
              "unite": "mL/24 h",
              "valeur": "26–140"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Transparente, jaune plus ou moins foncé"
            }
          ]
        }
      ]
    }
  ],
  "cobaye": [
    {
      "nom": "Cobaye",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "37,2–39,5 (99,0–103,1)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "230–380"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "42–104"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "43 ± 12"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "4,5–5,9"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "80–110",
              "detail": "soit 4,4–6,1 mmol/L"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "0,11–0,56",
              "detail": "anglais à poil court, analyseur de gaz sanguins"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "0,003–0,73",
              "detail": "lignée Dunkin-Hartley, analyseur de gaz sanguins"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "9,0–31,5"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,6–2,2"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,0–7,6"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "8,2–12,0"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "pH",
              "unite": "",
              "valeur": "9,0"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Jaune ambré ; opaque"
            }
          ]
        }
      ]
    }
  ],
  "chinchilla": [
    {
      "nom": "Chinchilla",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "37–38 (98,6–100,4)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "200–350"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "45–80"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "37 (35–40)"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,6 (5,3–6,0)"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "180 (163–197)",
              "detail": "soit 9,0–10,9 mmol/L"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,014 à > 1,060"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "mg/dL",
              "valeur": "6–87"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "8,5"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Jaune ambré"
            }
          ]
        }
      ]
    }
  ],
  "rongeur": [
    {
      "nom": "Rat",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "37,5 (99,5)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "250–500"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "33–47"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,6–7,4"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "50–135",
              "detail": "soit 2,8–7,5 mmol/L"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "1,9–5,61",
              "detail": "mâles (rats Wistar), analyseur de gaz sanguins"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "1,15–5,42",
              "detail": "femelles (rats Wistar), analyseur de gaz sanguins"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "15–21"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,2–0,8"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "5,3–8,3"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "5,3–13,0"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,022–1,050"
            },
            {
              "nom": "Protéines urinaires",
              "unite": "mg/dL",
              "valeur": "< 30"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "7,0–7,4"
            },
            {
              "nom": "Volume urinaire",
              "unite": "mL/24 h",
              "valeur": "13–23"
            }
          ]
        }
      ]
    },
    {
      "nom": "Souris",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "37–37,2 (98,8–99,3)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "310–840"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "60–220"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "34–50"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "4,6–6,9"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "90–193",
              "detail": "soit 5,0–10,7 mmol/L"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "0,04–1,09",
              "detail": "mâles (souris C57BL/6), analyseur de gaz sanguins"
            },
            {
              "nom": "Lactate",
              "unite": "mmol/L",
              "valeur": "0,04–0,8",
              "detail": "femelles (souris C57BL/6), analyseur de gaz sanguins"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "27,5–34,7"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,74–1,01"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "10,4–13,8"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "10,7–12,4"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,034–1,058"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "7,3–8,5"
            },
            {
              "nom": "Volume urinaire",
              "unite": "mL/24 h",
              "valeur": "0,5–2,5"
            }
          ]
        }
      ]
    },
    {
      "nom": "Hamster",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "36,2–37,5 (97,2–99,5)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "280–412"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "33–127"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "45–52"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,2–7,0"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "84,0 ± 18,5 (M) ; 100,0 ± 16,6 (F)"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "12–25"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,91–0,99"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,4–8,2"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "5–12"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Densité urinaire",
              "unite": "",
              "valeur": "1,050–1,060"
            },
            {
              "nom": "pH",
              "unite": "",
              "valeur": "Basique"
            },
            {
              "nom": "Volume urinaire",
              "unite": "mL/24 h",
              "valeur": "5,1–8,4"
            },
            {
              "nom": "Aspect",
              "unite": "",
              "valeur": "Trouble"
            }
          ]
        }
      ]
    },
    {
      "nom": "Gerbille",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "38,2 (100,8)"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "41–52"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,6 (4,6–6,3)"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "17–27"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,6–1,4"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "3,7–6,2"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "3,7–6,1"
            }
          ]
        },
        {
          "titre": "Urine",
          "lignes": [
            {
              "nom": "Volume urinaire",
              "unite": "mL/24 h",
              "valeur": "Quelques gouttes à 4 mL"
            }
          ]
        }
      ]
    }
  ],
  "herisson": [
    {
      "nom": "Hérisson",
      "sections": [
        {
          "titre": "Signes vitaux",
          "lignes": [
            {
              "nom": "Température",
              "unite": "°C (°F)",
              "valeur": "35,4–37,0 (95,7–98,6)"
            },
            {
              "nom": "Fréquence cardiaque",
              "unite": "battements/min",
              "valeur": "180–280"
            },
            {
              "nom": "Fréquence respiratoire",
              "unite": "respirations/min",
              "valeur": "25–50"
            }
          ]
        },
        {
          "titre": "Sang",
          "lignes": [
            {
              "nom": "Hématocrite",
              "unite": "%",
              "valeur": "36 ± 7"
            },
            {
              "nom": "Protéines totales",
              "unite": "g/dL",
              "valeur": "5,8 ± 0,7"
            },
            {
              "nom": "Glycémie",
              "unite": "mg/dL",
              "valeur": "89 ± 30"
            }
          ]
        },
        {
          "titre": "Biochimie rénale",
          "lignes": [
            {
              "nom": "Urée (BUN)",
              "unite": "mg/dL",
              "valeur": "13–54"
            },
            {
              "nom": "Créatinine",
              "unite": "mg/dL",
              "valeur": "0,4–0,8"
            },
            {
              "nom": "Phosphore",
              "unite": "mg/dL",
              "valeur": "2,4–12,0"
            },
            {
              "nom": "Calcium total",
              "unite": "mg/dL",
              "valeur": "5,2–11,3"
            }
          ]
        }
      ]
    }
  ]
}
