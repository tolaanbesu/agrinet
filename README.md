# 🌾 AgriNet — Agricultural Networking Platform

[![Next.js Platform](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL Engine](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v20.20.1-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)

An integrated multi-layered web ecosystem engineered to eliminate traditional manual intermediaries in the Ethiopian agricultural landscape. AgriNet establishes a secure, transparent, and high-performance digital web marketplace, real-time advisory module, and cooperative network connecting farmers directly with commercial buyers, wholesalers, and consumers.

---

## 🚀 Website Subsystem Architecture

The AgriNet web platform decomposes into specific target packages:

* **👥 User Web Package:** Handles multi-actor authentication, secure session handling, profile customization, and localized Role-Based Access Control (RBAC) boundaries.
* **🌽 Marketplace & Listing Package:** Complete web catalog interface. Supports crop categorization, product listing lifecycles, advanced query filtering, and photo file management.
* **🛒 Shopping Cart Management:** Client-side and server-persistent state arrays monitoring dynamic product additions, unit updates, subtotal math, and adjustments.
* **💳 Order Lifecycle Processing:** Transaction boundaries managing checkout processing, dynamic stock reduction, history logs, and order tracking states (`Pending`, `Completed`, `Cancelled`).
* **🧑‍🔬 Expert Advisory Package:** Dedicated communication hub enabling certified agricultural professionals to publish guides, post alerts, and answer query streams sent by farmers.
* **💬 Real-Time Chat Package:** In-app direct messaging pipelines and status notifications bridging negotiation channels between registered farmers and buyers.
* **📊 Admin Moderation Subsystem:** Central administrative panel tracking dashboard analytics, user status verifications, report lists, and illegal content removal tools.

---

## 💻 Tech Stack & Environment Baselines

| Component Layer | Technology Matrix | Version Baseline | Operational Scope |
| :--- | :--- | :--- | :--- |
| **Frontend UI View** | Next.js / Tailwind CSS | `14.x` | Modern, responsive web dashboards |
| **Data Relational ORM**| Prisma Client | `5.x` | Secure database abstraction layer |
| **Core Database Engine**| PostgreSQL Server | `15.x` or superior | Distributed transaction data store |
| **Server Runtime Env** | Node.js | `v20.20.1` | Stable backend runtime lifecycle |
| **Package Dependency** | npm | `v10.8.2` | Orchestration and execution tool |

---

👥 Development Team

This ecosystem has been systematically engineered and delivered by:

    1. Lisan Gebretensay

    2. Tola Anbesu

    3. Yohannes Gizaw

    4. Nathnael Hailemariam

🏛️ Addis Ababa University 🎓 Department of Computer Science 📅 2026



# Install project node modules and dependencies
npm install
