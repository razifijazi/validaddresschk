# Address Validator

🦞 **Live Address Validation Tool** powered by Smarty USPS API

## Features

- ✅ Real-time USPS address validation
- 📊 Batch validation support (multiple addresses at once)
- 🎨 Modern, responsive UI
- 🔒 Secure backend API (credentials protected)
- 📍 Full address details: ZIP+4, coordinates, county, timezone
- 🏠 Vacancy and delivery status

## Demo

Live demo: http://43.157.242.19:3000

## Installation

```bash
git clone https://github.com/razifijazi/validaddresschk.git
cd validaddresschk
npm install
```

## Configuration

Edit `server.js` and add your Smarty API credentials:

```javascript
const AUTH_ID = 'your-auth-id';
const AUTH_TOKEN = 'your-auth-token';
```

## Usage

Start the server:

```bash
node server.js
```

Open browser: `http://localhost:3000`

### Input Format

Enter addresses one per line with pipe delimiter:

```
street|city|state|zipcode
```

**Example:**

```
100 Hunter Lane|Enfield|CT|06082
3754 NW 31st Ave|Camas|WA|98607
133 Krupp Ave|Liberty Hill|TX|78642
```

## API Endpoint

**POST** `/api/validate`

Request body:
```json
{
  "street": "100 Hunter Lane",
  "city": "Enfield",
  "state": "CT",
  "zipcode": "06082"
}
```

Response (valid):
```json
[
  {
    "delivery_line_1": "100 Hunter Ln",
    "last_line": "Enfield CT 06082-4136",
    "components": { ... },
    "metadata": { ... },
    "analysis": { ... }
  }
]
```

Response (invalid):
```json
[]
```

## Tech Stack

- Node.js (backend)
- Vanilla JavaScript (frontend)
- Smarty USPS API

## License

MIT

## Author

Rajeep (@razifijazi)
