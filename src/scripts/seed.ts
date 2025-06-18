import { db, articles, users, NewArticle, NewUser } from "../db";
import { createId } from "@paralleldrive/cuid2";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

async function seedDatabase() {
    try {
        console.log("🌱 Starting database seeding...");

        await db.delete(articles);
        console.log("🗑️  Cleared existing articles");

        await db.delete(users);
        console.log("🗑️  Cleared existing users");

        const sampleUsers: NewUser[] = [
            {
                id: randomUUID(),
                email: "budi.santoso@example.com",
                password: await bcrypt.hash("password123", 10),
                name: "Budi Santoso",
                title: "Jurnalis Olahraga",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
                id: randomUUID(),
                email: "sarah.wijaya@example.com",
                password: await bcrypt.hash("password123", 10),
                name: "Sarah Wijaya",
                title: "Tech Journalist",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            },
            {
                id: randomUUID(),
                email: "ahmad.hidayat@example.com",
                password: await bcrypt.hash("password123", 10),
                name: "Dr. Ahmad Hidayat",
                title: "Marine Biologist",
                avatar: "https://randomuser.me/api/portraits/men/55.jpg",
            },
            {
                id: randomUUID(),
                email: "rina.melati@example.com",
                password: await bcrypt.hash("password123", 10),
                name: "Rina Melati",
                title: "Business Reporter",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            },
            {
                id: randomUUID(),
                email: "rudi.hartono@example.com",
                password: await bcrypt.hash("password123", 10),
                name: "Chef Rudi Hartono",
                title: "Culinary Expert",
                avatar: "https://randomuser.me/api/portraits/men/77.jpg",
            },
            {
                id: randomUUID(),
                email: "linda.sari@example.com",
                password: await bcrypt.hash("password123", 10),
                name: "Prof. Dr. Linda Sari",
                title: "Medical Researcher",
                avatar: "https://randomuser.me/api/portraits/women/89.jpg",
            },
            {
                id: randomUUID(),
                email: "maya.kartika@example.com",
                password: await bcrypt.hash("password123", 10),
                name: "Maya Kartika",
                title: "Fashion Journalist",
                avatar: "https://randomuser.me/api/portraits/women/23.jpg",
            },
            {
                id: randomUUID(),
                email: "bambang.tejasukmana@example.com",
                password: await bcrypt.hash("password123", 10),
                name: "Dr. Bambang Tejasukmana",
                title: "Space Scientist",
                avatar: "https://randomuser.me/api/portraits/men/91.jpg",
            },
            {
                id: randomUUID(),
                email: "siti.nurhaliza@example.com",
                password: await bcrypt.hash("password123", 10),
                name: "Dra. Siti Nurhaliza",
                title: "Education Specialist",
                avatar: "https://randomuser.me/api/portraits/women/34.jpg",
            },
            {
                id: randomUUID(),
                email: "rio.pratama@example.com",
                password: await bcrypt.hash("password123", 10),
                name: "Rio Pratama",
                title: "Gaming Journalist",
                avatar: "https://randomuser.me/api/portraits/men/12.jpg",
            },
        ];

        const insertedUsers = await db
            .insert(users)
            .values(sampleUsers)
            .returning();
        console.log(`👤 Inserted ${insertedUsers.length} users`);

        const sampleArticles: NewArticle[] = [
            {
                id: createId(),
                title: "Pecco Bagnaia Berhasil Pertahankan Gelar Juara Dunia MotoGP 2023",
                category: "MotoGP",
                publishedAt: "27 Nov 2023",
                readTime: "6 menit",
                authorId: insertedUsers[0].id, // Budi Santoso
                imageUrl:
                    "https://images.unsplash.com/photo-1562402082-05a4e888ca96?q=80&w=1121&auto=format&fit=crop",
                isTrending: true,
                tags: ["MotoGP", "Bagnaia", "Ducati"],
                content:
                    'Francesco "Pecco" Bagnaia telah membuktikan dirinya sebagai salah satu pembalap terbaik di dunia dengan berhasil mempertahankan gelar juara dunia MotoGP untuk musim 2023. Pembalap Ducati berusia 26 tahun ini menunjukkan konsistensi yang luar biasa sepanjang musim, dengan meraih beberapa kemenangan spektakuler di sirkuit-sirkuit menantang...',
            },
            {
                id: createId(),
                title: "Revolusi AI dalam Dunia Teknologi: Dampak dan Masa Depan",
                category: "Teknologi",
                publishedAt: "25 Nov 2023",
                readTime: "8 menit",
                authorId: insertedUsers[1].id, // Sarah Wijaya
                imageUrl:
                    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1170&auto=format&fit=crop",
                isTrending: true,
                tags: ["AI", "Technology", "Future"],
                content:
                    "Kecerdasan Buatan (AI) telah mengubah lanskap teknologi global dengan cara yang tidak pernah dibayangkan sebelumnya. Dari asisten virtual hingga kendaraan otonom, AI kini menjadi bagian integral dari kehidupan sehari-hari. Artikel ini mengeksplorasi bagaimana revolusi AI mempengaruhi berbagai sektor industri...",
            },
            {
                id: createId(),
                title: "Dampak Perubahan Iklim Terhadap Ekosistem Laut Indonesia",
                category: "Lingkungan",
                publishedAt: "23 Nov 2023",
                readTime: "7 menit",
                authorId: insertedUsers[2].id, // Dr. Ahmad Hidayat
                imageUrl:
                    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1170&auto=format&fit=crop",
                isTrending: false,
                tags: ["Climate Change", "Marine", "Environment"],
                content:
                    "Indonesia sebagai negara kepulauan terbesar di dunia menghadapi tantangan serius akibat perubahan iklim. Ekosistem laut yang kaya dan beragam kini terancam oleh naiknya suhu air laut, perubahan pola arus, dan peningkatan keasaman laut. Penelitian terbaru menunjukkan dampak signifikan terhadap terumbu karang...",
            },
            {
                id: createId(),
                title: "Startup Fintech Indonesia Raih Pendanaan Seri B Senilai $50 Juta",
                category: "Business",
                publishedAt: "22 Nov 2023",
                readTime: "5 menit",
                authorId: insertedUsers[3].id, // Rina Melati
                imageUrl:
                    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1170&auto=format&fit=crop",
                isTrending: true,
                tags: ["Fintech", "Startup", "Investment"],
                content:
                    "Sektor fintech Indonesia terus menunjukkan pertumbuhan yang menggembirakan dengan berhasilnya sebuah startup lokal meraih pendanaan Seri B senilai $50 juta. Pendanaan ini dipimpin oleh investor internasional terkemuka dan akan digunakan untuk ekspansi produk serta penetrasi pasar yang lebih luas...",
            },
            {
                id: createId(),
                title: "Festival Kuliner Nusantara 2023: Celebrating Indonesian Food Heritage",
                category: "Kuliner",
                publishedAt: "20 Nov 2023",
                readTime: "4 menit",
                authorId: insertedUsers[4].id, // Chef Rudi Hartono
                imageUrl:
                    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1170&auto=format&fit=crop",
                isTrending: false,
                tags: ["Food", "Culture", "Festival"],
                content:
                    "Festival Kuliner Nusantara 2023 telah sukses diselenggarakan dengan menghadirkan lebih dari 200 chef dan pelaku kuliner dari seluruh Indonesia. Acara yang berlangsung selama tiga hari ini menampilkan kekayaan cita rasa tradisional yang dikemas dengan sentuhan modern...",
            },
            {
                id: createId(),
                title: "Breakthrough dalam Penelitian Sel Punca untuk Pengobatan Diabetes",
                category: "Kesehatan",
                publishedAt: "18 Nov 2023",
                readTime: "9 menit",
                authorId: insertedUsers[5].id, // Prof. Dr. Linda Sari
                imageUrl:
                    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1170&auto=format&fit=crop",
                isTrending: true,
                tags: ["Healthcare", "Research", "Diabetes"],
                content:
                    "Tim peneliti dari Universitas Indonesia berhasil mencapai terobosan penting dalam pengembangan terapi sel punca untuk pengobatan diabetes tipe 1. Penelitian yang telah berlangsung selama lima tahun ini menunjukkan hasil yang sangat menjanjikan dalam uji praklinis...",
            },
            {
                id: createId(),
                title: "Tren Fashion Sustainable: Masa Depan Industri Mode Indonesia",
                category: "Fashion",
                publishedAt: "16 Nov 2023",
                readTime: "6 menit",
                authorId: insertedUsers[6].id, // Maya Kartika
                imageUrl:
                    "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1171&auto=format&fit=crop",
                isTrending: false,
                tags: ["Fashion", "Sustainability", "Trends"],
                content:
                    "Industri fashion Indonesia mulai bergerak menuju praktik yang lebih berkelanjutan dengan munculnya brand-brand lokal yang mengadopsi konsep sustainable fashion. Tren ini tidak hanya mengutamakan aspek lingkungan, tetapi juga pemberdayaan komunitas lokal dan pelestarian budaya tradisional...",
            },
            {
                id: createId(),
                title: "Eksplorasi Ruang Angkasa: Misi Mars 2024 dan Peran Indonesia",
                category: "Sains",
                publishedAt: "14 Nov 2023",
                readTime: "10 menit",
                authorId: insertedUsers[7].id, // Dr. Bambang Tejasukmana
                imageUrl:
                    "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1170&auto=format&fit=crop",
                isTrending: true,
                tags: ["Space", "Mars", "Science"],
                content:
                    "Tahun 2024 menandai era baru dalam eksplorasi ruang angkasa dengan rencana misi ambisius ke Planet Mars. Indonesia melalui LAPAN (Lembaga Penerbangan dan Antariksa Nasional) ikut berpartisipasi dalam proyek internasional ini dengan menyumbangkan teknologi satelit dan keahlian di bidang navigasi...",
            },
            {
                id: createId(),
                title: "Revolusi Pendidikan Digital: Pembelajaran Hybrid di Era Post-Pandemic",
                category: "Pendidikan",
                publishedAt: "12 Nov 2023",
                readTime: "7 menit",
                authorId: insertedUsers[8].id, // Dra. Siti Nurhaliza
                imageUrl:
                    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1122&auto=format&fit=crop",
                isTrending: false,
                tags: ["Education", "Digital", "Hybrid Learning"],
                content:
                    "Sistem pendidikan Indonesia mengalami transformasi signifikan dengan adopsi model pembelajaran hybrid yang menggabungkan metode konvensional dan digital. Penelitian menunjukkan bahwa pendekatan ini memberikan fleksibilitas yang lebih baik bagi siswa sambil mempertahankan kualitas interaksi sosial...",
            },
            {
                id: createId(),
                title: "Kebangkitan E-Sports Indonesia: Dari Hobi Menjadi Industri Milyaran",
                category: "Gaming",
                publishedAt: "10 Nov 2023",
                readTime: "8 menit",
                authorId: insertedUsers[9].id, // Rio Pratama
                imageUrl:
                    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1170&auto=format&fit=crop",
                isTrending: true,
                tags: ["Gaming", "E-Sports", "Industry"],
                content:
                    "Industri e-sports Indonesia telah berkembang pesat menjadi sektor ekonomi yang menjanjikan dengan nilai mencapai miliaran rupiah. Dari yang awalnya hanya sebagai hobi, kini e-sports telah menjadi profesi yang legitim dengan berbagai turnamen bergengsi dan sponsorship dari perusahaan multinasional...",
            },
        ];

        await db.insert(articles).values(sampleArticles);
        console.log(`📝 Inserted ${sampleArticles.length} articles`);

        const categories = [
            ...new Set(sampleArticles.map((article) => article.category)),
        ];
        console.log(`📂 Categories: ${categories.join(", ")}`);
        console.log(
            `🔥 Trending articles: ${
                sampleArticles.filter((a) => a.isTrending).length
            }`
        );
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    }
}

if (require.main === module) {
    seedDatabase().then(() => {
        process.exit(0);
    });
}

export { seedDatabase };
