# MongoDB Collections (The Filing Cabinets)

Let's break down each Collection (those names like devices, users, etc.) with a clear explanation, how to handle them manually, and a Malayalam analogy.

## 1. devices

**What it is:** The inventory of all smart appliances connected to your system.

**Purpose:** It stores the Name ("Living Room AC"), Type ("Energy"), Status (isOn: true/false), and Consumption rate.

**How it gets "fed" (Data Entry):**

- **Automatically:** When you click "Add Device" in the Dashboard.
- **Seeding:** When you first started the app, the code added default devices so it wasn't empty.

**Manual Presentation Tip:** If you accidentally add a device with a spelling mistake during the demo, you can go here in Compass, find that line, and click the Trash icon to delete it instantly.

🌟 **Malayalam Example:** The Stock Register (Stock Book) in a shop. It lists every item currently available on the shelf. If you buy a new item to sell, you write it in this book.

**Malayalam:** Oru kadayile 'Stock Register' pole. Kadayil irikkunna ella sadhanangaludeyum vivaram (AC, Fan, Light) ithil ezhuthi vekkunnu. Puthiya sadhanam vannaal ivide cherkkum.

## 2. energylogs

**What it is:** The history book of electricity usage.

**Purpose:** This data draws the Green Bars on your Energy Chart. Every document here represents a specific amount of energy used on a specific day.

**How it gets "fed":**

- **Real-time:** Every time you turn a device ON, the backend writes a new line here.
- **Seeding:** The `npm run seed:history` command created 49 fake entries here so your chart looks full for the last 7 days.

**Manual Presentation Tip:** If your Energy Chart looks empty (blank), it means this collection is empty. You need to run the seed command again.

🌟 **Malayalam Example:** The Electricity Meter Reading Book. The KSEB man comes and writes down how much you used. You cannot change it later; it is just a record of what happened.

**Malayalam:** 'Meter Reading Book' pole. Nammal ethra current upayogichu ennu ezhuthi vekkunna pusthakam. Chart varakkanu vendi ee kanakku aanu upayogikkunnath.

## 3. waterlogs

**What it is:** The history book of water usage.

**Purpose:** This draws the Blue/Red Bars on your Water Chart.

**How it gets "fed":** Same as energy logs—created when water devices run or by the seed script.

**Manual Presentation Tip:** The "Simulate Leak" button adds a massive fake entry into this collection for "Sunday". If you want to "reset" the demo completely, you can delete the documents in this collection.

🌟 **Malayalam Example:** The Water Meter Book. Just like the electricity book, but tracking liters of water instead of watts of power.

**Malayalam:** 'Vella-kkaram' (Water Bill) ezhuthunna book pole. Ethra vellam upayogichu ennu ithil kurichu vekkunnu.

## 4. settings

**What it is:** The user's personal preferences.

**Purpose:** It remembers where you left the Sliders (e.g., Energy Limit = 15, Water Limit = 100). Without this, the sliders would reset every time you refresh.

**How it gets "fed":** Every time you let go of a slider in the "Settings" tab, the code updates the numbers in this collection.

**Manual Presentation Tip:** If the sliders are stuck or acting weird, you can delete the document in this collection. The code is smart enough to create a fresh default one automatically.

🌟 **Malayalam Example:** Standing Instructions (Nirdeshangal) given to a servant. "Don't use more than 5 buckets of water today." Even if you go to sleep, the instruction remains there.

**Malayalam:** Jolikkarodu parayunna 'Nirdeshangal' pole. "Innu 15 Unit current mathre upayogikkavu" ennu ezhuthi vekkunnu. Nammal paranjilla engilum, aa nirdesham avide undakum.

## 5. users

**What it is:** The list of people allowed to log in.

**Purpose:** It stores your email and your Hashed Password (encrypted so no one can read it).

**How it gets "fed":** When you used the "Register" page or the default login provided.

**Manual Presentation Tip:** Never manually edit the password here directly because it needs to be encrypted (hashed). If you forget the password, just delete the user here and Register a new one in the app.

🌟 **Malayalam Example:** The ID Card Register at a secure office. Only people listed in this book are allowed to enter the building.

**Malayalam:** Office-il keranulla 'Register' book. Ithil perulla aalkkare mathrame ullilekku kadathi vidukayullu.

---

## 💡 Summary for your Manual Control

If something goes wrong during the presentation, here is your "Emergency Kit":

### "My charts are empty!"

**Fix:** The energylogs and waterlogs are empty. Run `npm run seed:history` in your server terminal.

### "I made a spelling mistake in a device name!"

**Fix:** Open the devices collection in Compass, find the bad name, click the Trash Can icon on the right side of that line.

### "I want to restart fresh."

**Fix:** You can delete the energylogs and waterlogs collections entirely inside Compass. Then run the seed command again to get fresh, clean data.

