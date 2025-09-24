LOGIN_URL="https://localhost:3000/gate/user/login"
GAMES_URL="https://localhost:3000/gate/game/"

# LOGIN
COOKIE=$(curl -k -s -D - \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"identifier":"user1","plainPassword":"Test0000."}' \
  "$LOGIN_URL" | grep -i "Set-Cookie" | sed -E 's/Set-Cookie: ([^;]+).*/\1/i')

# GET ROOM ID
ROOMS=$(curl -k -s \
  -H "Content-Type: application/json" \
  -H "Cookie: $COOKIE" \
  "$GAMES_URL")

echo "$ROOMS" | jq -r 'to_entries | .[] | "\(.key): \(.value.id) [mode=\(.value.mode)] players=\(.value.players|length)/\(.value.max)"'

# Demander à l'utilisateur quelle room choisir
echo -n "👉 SELECT id : "
read -r CHOICE

# Vérifier si c'est un nombre (index)
if [[ "$CHOICE" =~ ^[0-9]+$ ]]; then
  ROOM_ID=$(echo "$ROOMS" | jq -r ".[$CHOICE].id")
fi

if [[ "$ROOM_ID" == "null" || -z "$ROOM_ID" ]]; then
  echo "error"
  exit 1
fi

echo "'up' |'down'"

while true; do
  read -r INPUT
  if [[ "$INPUT" == "up" || "$INPUT" == "down" ]]; then
    curl -k -s \
      -H "Content-Type: application/json" \
      -H "Cookie: $COOKIE" \
      -X POST \
      -d "{\"type\":\"keydown\",\"key\":\"$INPUT\"}" \
      "https://localhost:3000/gate/game/$ROOM_ID" >/dev/null
    echo "SEND: $INPUT"
  fi
done
