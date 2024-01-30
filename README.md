## To-do
- [ ] Add form validation
- [ ] Issue best time VCs to users with DIDs
- [ ] Address deprecated code property on `storageAvailable` function
- [ ] Update [emoji.json](emoji.json) to include all emoji from [microsoft/fluentui-emoji](https://github.com/microsoft/fluentui-emoji)
- [ ] Let people customize card preview time, card background color, number or cards, emojis, language, etc.

## Issues (that I know of 😅)
### 1. Some emoji names don't match the [unicode CLDR short name](https://unicode.org/Public/emoji/15.1/emoji-test.txt). [More Info](https://www.unicode.org/emoji/charts-15.1/)

Emoji|Unicode CLDR Short Name|Microsoft Name
---|---|---
🐦‍⬛|Black bird|Blackbird
😡|Enraged face|Pouting Face
😵|Face with crossed-out eyes|Dizzy
🤗|Smiling face with open hands|Hugging face

### 2. Some emoji are missing from their SVG set
- Smiley & Emotions
- People & Body
  - person-role
    - technologist
    - man technologist
    - woman technologist
  - family
    - people holding hands
    - women holding hands
    - woman and man holding hands
    - men holding hands
    - kiss
    - kiss: woman, man
    - kiss: man, man
    - kiss: woman, woman
    - couple with heart
    - couple with heart: woman, man
    - couple with heart: man, man
    - couple with heart: woman, woman
    - family: man, woman, boy
    - family: man, woman, girl
    - family: man, woman, girl, boy
    - family: man, woman, boy, boy
    - family: man, woman, girl, girl
    - family: man, man, boy
    - family: man, man, girl
    - family: man, man, girl, boy
    - family: man, man, boy, boy
    - family: man, man, girl, girl
    - family: woman, woman, boy
    - family: woman, woman, girl
    - family: woman, woman, girl, boy
    - family: woman, woman, boy, boy
    - family: woman, woman, girl, girl
    - family: man, boy
    - family: man, boy, boy
    - family: man, girl
    - family: man, girl, boy
    - family: man, girl, girl
    - family: woman, boy
    - family: woman, boy, boy
    - family: woman, girl
    - family: woman, girl, boy
    - family: woman, girl, girl
  - person-symbol
    - family
  - game
    - video_game
  - office
    - paperclip
  - keycap
    - keycap: #
  - alphanum
    - O button (blood type)
    - UP! button
- Flags
  - country-flag
    - flag: Ascension Island
    - flag: Andorra
    - flag: United Arab Emirates
    - flag: afghanistan
    - flag: antigua_barbuda
    - flag: anguilla
    - flag: albania
    - flag: armenia
    - flag: angola
    - flag: antarctica
    - flag: argentina
    - flag: american_samoa
    - flag: australia
    - flag: austria
    - flag: aruba
    - flag: aland_islands
    - flag: azerbaijan
    - flag: bosnia_herzegovina
    - flag: barbados
    - flag: bangladesh
    - flag: belgium
    - flag: burkina_faso
    - flag: bulgaria
    - flag: bahrain
    - flag: burundi
    - flag: benin
    - flag: st_barthelemy
    - flag: bermuda
    - flag: brunei
    - flag: bolivia
    - flag: caribbean_netherlands
    - flag: brazil
    - flag: bahamas
    - flag: bhutan
    - flag: bouvet_island
    - flag: botswana
    - flag: belarus
    - flag: belize
    - flag: canada
    - flag: cocos_islands
    - flag: congo_kinshasa
    - flag: central_african_republic
    - flag: congo_brazzaville
    - flag: cote_d_ivoire
    - flag: switzerland
    - flag: cook_islands
    - flag: chile
    - flag: cameroon
    - flag: china
    - flag: colombia
    - flag: clipperton_island
    - flag: costa_rica
    - flag: cuba
    - flag: cape_verde
    - flag: curacao
    - flag: cyprus
    - flag: christmas_island
    - flag: czechia
    - flag: germany
    - flag: diego_garcia
    - flag: djibouti
    - flag: denmark
    - flag: dominica
    - flag: dominican_republic
    - flag: algeria
    - flag: ceuta_melilla
    - flag: ecuador
    - flag: estonia
    - flag: egypt
    - flag: western_sahara
    - flag: eritrea
    - flag: spain
    - flag: ethiopia
    - flag: european_union
    - flag: finland
    - flag: fiji
    - flag: falkland_islands
    - flag: micronesia
    - flag: faroe_islands
    - flag: gabon
    - flag: france
    - flag: united_kingdom
    - flag: grenada
    - flag: georgia
    - flag: french_guiana
    - flag: guernsey
    - flag: ghana
    - flag: gibraltar
    - flag: greenland
    - flag: gambia
    - flag: guinea
    - flag: guadeloupe
    - flag: equatorial guinea
    - flag: greece
    - flag: south georgia_south_sandwich_islands
    - flag: guatemala
    - flag: guam
    - flag: guinea bissau
    - flag: guyana
    - flag: hong_kong_sar_china
    - flag: heard_mcdonald_islands
    - flag: honduras
    - flag: croatia
    - flag: haiti
    - flag: hungary
    - flag: canary_islands
    - flag: indonesia
    - flag: ireland
    - flag: israel
    - flag: isle_of_man
    - flag: india
    - flag: british_indian_ocean_territory
    - flag: iraq
    - flag: iran
    - flag: iceland
    - flag: italy
    - flag: jersey
    - flag: jamaica
    - flag: jordan
    - flag: japan
    - flag: kenya
    - flag: kyrgyzstan
    - flag: cambodia
    - flag: kiribati
    - flag: comoros
    - flag: st_kitts_nevis
    - flag: north_korea
    - flag: south_korea
    - flag: kuwait
    - flag: cayman_islands
    - flag: kazakhstan
    - flag: laos
    - flag: lebanon
    - flag: st_lucia
    - flag: liechtenstein
    - flag: sri_lanka
    - flag: liberia
    - flag: lesotho
    - flag: lithuania
    - flag: latvia
    - flag: luxembourg
    - flag: libya
    - flag: morocco
    - flag: monaco
    - flag: moldova
    - flag: montenegro
    - flag: st_martin
    - flag: madagascar
    - flag: marshall_islands
    - flag: north_macedonia
    - flag: mali
    - flag: myanmar
    - flag: mongolia
    - flag: macao_sar_china
    - flag: northern_mariana_islands
    - flag: martinique
    - flag: mauritania
    - flag: montserrat
    - flag: malta
    - flag: mauritius
    - flag: maldives
    - flag: malawi
    - flag: mexico
    - flag: malaysia
    - flag: mozambique
    - flag: new_caledonia
    - flag: namibia
    - flag: niger
    - flag: norfolk_island
    - flag: nigeria
    - flag: nicaragua
    - flag: netherlands
    - flag: norway
    - flag: nepal
    - flag: nauru
    - flag: niue
    - flag: new_zealand
    - flag: oman
    - flag: panama
    - flag: peru
    - flag: french_polynesia
    - flag: papua_new_guinea
    - flag: philippines
    - flag: poland
    - flag: pakistan
    - flag: pitcairn_islands
    - flag: st_pierre_miquelon
    - flag: puerto_rico
    - flag: palestinian_territories
    - flag: portugal
    - flag: paraguay
    - flag: palau
    - flag: qatar
    - flag: reunion
    - flag: romania
    - flag: serbia
    - flag: russia
    - flag: rwanda
    - flag: saudi_arabia
    - flag: solomon_islands
    - flag: seychelles
    - flag: sudan
    - flag: sweden
    - flag: singapore
    - flag: st_helena
    - flag: slovenia
    - flag: slovakia
    - flag: svalbard_jan_mayen
    - flag: sierra_leone
    - flag: san_marino
    - flag: senegal
    - flag: somalia
    - flag: suriname
    - flag: south_sudan
    - flag: sao_tome_principe
    - flag: el_salvador
    - flag: sint_maarten
    - flag: syria
    - flag: eswatini
    - flag: tristan_da_cunha
    - flag: turks_caicos_islands
    - flag: french_southern_territories
    - flag: chad
    - flag: togo
    - flag: thailand
    - flag: tajikistan
    - flag: tokelau
    - flag: timor_leste
    - flag: turkmenistan
    - flag: tunisia
    - flag: tonga
    - flag: trinidad_tobago
    - flag: turkey
    - flag: tuvalu
    - flag: taiwan
    - flag: tanzania
    - flag: ukraine
    - flag: u_s_outlying_islands
    - flag: uganda
    - flag: united_states
    - flag: united_nations
    - flag: uruguay
    - flag: uzbekistan
    - flag: vatican_city
    - flag: st_vincent_grenadines
    - flag: venezuela
    - flag: british_virgin_islands
    - flag: u_s_virgin_islands
    - flag: vietnam
    - flag: vanuatu
    - flag: wallis_futuna
    - flag: samoa
    - flag: kosovo
    - flag: yemen
    - flag: mayotte
    - flag: south_africa
    - flag: zambia
    - flag: zimbabwe
    - flag: england
    - flag: scotland
    - flag: wales

## Web 5 Challenges
- [Quickstart guide](https://developer.tbd.website/docs/web5/build/decentralized-identifiers/how-to-create-did) is still incorrect. [See issue here](https://github.com/TBD54566975/developer.tbd.website/issues/1070#event-11367598025).
