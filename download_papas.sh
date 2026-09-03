#!/bin/bash

games=(
  "papas-pizzeria"
  "papas-freezeria"
  "papas-burgeria"
  "papas-tacomia"
  "papas-pancakeria"
  "papas-wingeria"
  "papas-hotdoggeria"
  "papas-cupcakeria"
  "papas-pastaria"
  "papas-donuteria"
  "papas-bakeria"
  "papas-sushiria"
  "papas-cheeseria"
  "papas-scooperia"
)

# Convert dash format to other formats
for game in "${games[@]}"; do
  echo "Setting up $game..."
  mkdir -p "pages/games/$game"

  # SWF destination
  dest="pages/games/$game/${game}.swf"

  # Determine alternative names for fetching
  name_nospace=$(echo "$game" | sed 's/-//') # e.g. papaspizzeria
  name_camel="Papas%20$(echo "$game" | cut -d'-' -f2 | awk '{print toupper(substr($0,1,1))tolower(substr($0,2))}')" # Papas%20Pizzeria

  # Try multiple sources
  urls=(
    "https://raw.githubusercontent.com/bladeclickers/bladeclickers.github.io/main/${game}.swf"
    "https://raw.githubusercontent.com/SJRNoodles/Flash-Game-Archive/master/${name_camel}.swf"
    "https://raw.githubusercontent.com/SJRNoodles/Flash-Game-Archive/master/${name_nospace}.swf"
    "https://archive.org/download/${name_nospace}_v2/${name_nospace}_v2.swf"
    "https://archive.org/download/${name_nospace}/${name_nospace}.swf"
    "https://archive.org/download/papas-games/${game}.swf"
  )

  success=0
  for url in "${urls[@]}"; do
    echo "  Trying $url ..."
    status=$(curl -sL -w "%{http_code}" -o "$dest" "$url")
    if [ "$status" = "200" ]; then
      # Make sure it's actually an SWF (should start with FWS or CWS or ZWS)
      magic=$(head -c 3 "$dest")
      if [[ "$magic" == "FWS" || "$magic" == "CWS" || "$magic" == "ZWS" ]]; then
        echo "  -> SUCCESS ($url)"
        success=1
        break
      fi
    fi
  done

  if [ $success -eq 0 ]; then
    echo "  -> FAILED to find valid SWF for $game!"
    rm -f "$dest"
  else
    # Create Ruffle index.html
    cat << 'HTML_EOF' > "pages/games/$game/index.html"
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; background-color: #000; height: 100vh; display: flex; justify-content: center; align-items: center; }
    #ruffle { width: 100vw; height: 100vh; }
  </style>
  <script src="/ruffle-nightly/ruffle.js"></script>
</head>
<body>
  <div id="ruffle"></div>
  <script>
    window.RufflePlayer = window.RufflePlayer || {};
    window.addEventListener("load", (event) => {
        const ruffle = window.RufflePlayer.newest();
        const player = ruffle.createPlayer();
        const container = document.getElementById("ruffle");
        container.appendChild(player);
        player.load("SWF_FILE");
    });
  </script>
</body>
</html>
HTML_EOF
    # replace SWF_FILE with actual file name
    sed -i "s/SWF_FILE/${game}.swf/g" "pages/games/$game/index.html"
  fi
done
