// Dummy product data for EduCycle marketplace

export const dummyProducts = [
    {
        _id: "1",
        name: "How Innovation Works",
        description: "Used textbook for CS101 course. Good condition with minimal highlighting.",
        price: 299,
        condition: "Good",
        category: "Books",
        images: [
            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        ],
        seller: {
            _id: "user1",
            name: "John Doe",
            email: "john@example.com",
            college: "MIT",
            department: "Computer Science",
            year: 3
        },
        createdAt: "2023-04-15T10:30:00Z",
        savedBy: ["user2", "user3"]
    },
    {
        _id: "2",
        name: "Scientific Calculator",
        description: "Texas Instruments TI-84 Plus calculator. Works perfectly.",
        price: 499,
        condition: "Like New",
        category: "Electronics",
        images: [
            "https://fareedbookcentre.com/cdn/shop/files/Untitleddesign-2024-06-04T015104.997.jpg?v=1717447874"
        ],
        seller: {
            _id: "user2",
            name: "Jane Smith",
            email: "jane@example.com",
            college: "Stanford",
            department: "Mathematics",
            year: 2
        },
        createdAt: "2023-04-10T14:20:00Z",
        savedBy: ["user1"]
    },
    {
        _id: "3",
        name: "Lab Coat",
        description: "White lab coat, size M. Used for one semester of chemistry lab.",
        price: 199,
        condition: "Good",
        category: "Clothing",
        images: [
            "https://lordsindia.com/cdn/shop/products/IMG_20190225_161834.jpg?v=1707763621"
        ],
        seller: {
            _id: "user3",
            name: "Alex Johnson",
            email: "alex@example.com",
            college: "Harvard",
            department: "Chemistry",
            year: 4
        },
        createdAt: "2023-04-05T09:15:00Z",
        savedBy: []
    },
    {
        _id: "4",
        name: "Organic Chemistry Notes",
        description: "Comprehensive notes from Organic Chemistry II. Includes all important reactions and mechanisms.",
        price: 149,
        condition: "Excellent",
        category: "Notes",
        images: [
            "https://llptg.wordpress.com/wp-content/uploads/2015/01/orgo-p1.jpg"
        ],
        seller: {
            _id: "user4",
            name: "Sarah Williams",
            email: "sarah@example.com",
            college: "Yale",
            department: "Biology",
            year: 3
        },
        createdAt: "2023-04-01T16:45:00Z",
        savedBy: ["user1", "user2", "user3"]
    },
    {
        _id: "5",
        name: "Laptop Stand",
        description: "Adjustable aluminum laptop stand. Helps with posture while studying.",
        price: 399,
        condition: "Like New",
        category: "Accessories",
        images: [
            "https://isomarsshop.in/cdn/shop/files/IMAGES_d4607703-5068-4e39-9a78-07f33e36c0fa.jpg?v=1740984508&width=1214"
        ],
        seller: {
            _id: "user5",
            name: "Michael Brown",
            email: "michael@example.com",
            college: "UC Berkeley",
            department: "Engineering",
            year: 2
        },
        createdAt: "2023-03-28T11:30:00Z",
        savedBy: ["user4"]
    },

    {
        _id: "7",
        name: "Study Desk Lamp",
        description: "LED desk lamp with adjustable brightness. Perfect for late-night study sessions.",
        price: 249,
        condition: "Like New",
        category: "Accessories",
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        ],
        seller: {
            _id: "user6",
            name: "Emily Davis",
            email: "emily@example.com",
            college: "Columbia",
            department: "Psychology",
            year: 1
        },
        createdAt: "2023-03-20T15:10:00Z",
        savedBy: ["user3", "user4"]
    },
    {
        _id: "8",
        name: "Backpack",
        description: "Water-resistant backpack with laptop compartment. Used for one semester.",
        price: 349,
        condition: "Good",
        category: "Accessories",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        ],
        seller: {
            _id: "user7",
            name: "David Wilson",
            email: "david@example.com",
            college: "UCLA",
            department: "Business",
            year: 4
        },
        createdAt: "2023-03-15T10:05:00Z",
        savedBy: ["user1", "user5"]
    },
    {
        _id: "9",
        name: "Microbiology Textbook",
        description: "Comprehensive microbiology textbook with detailed diagrams and explanations.",
        price: 449,
        condition: "Good",
        category: "Books",
        images: [
            "https://parasredkart.com/catalog/9789356968486%20(1).jpg"
        ],
        seller: {
            _id: "user8",
            name: "Lisa Anderson",
            email: "lisa@example.com",
            college: "Johns Hopkins",
            department: "Biology",
            year: 3
        },
        createdAt: "2023-03-10T14:30:00Z",
        savedBy: ["user4", "user6"]
    },
    {
        _id: "10",
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse. Great for long study sessions.",
        price: 199,
        condition: "Like New",
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        ],
        seller: {
            _id: "user9",
            name: "Robert Taylor",
            email: "robert@example.com",
            college: "Cornell",
            department: "Computer Science",
            year: 2
        },
        createdAt: "2023-03-05T09:40:00Z",
        savedBy: ["user2", "user7"]
    }
];

// Dummy user profiles
export const dummyUsers = [
    {
        _id: "user1",
        name: "John Doe",
        email: "john@example.com",
        college: "MIT",
        department: "Computer Science",
        year: 3,
        profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        bio: "Computer Science major with a passion for AI and machine learning.",
        listings: ["1", "6"],
        savedItems: ["2", "4", "8"]
    },
    {
        _id: "user2",
        name: "Jane Smith",
        email: "jane@example.com",
        college: "Stanford",
        department: "Mathematics",
        year: 2,
        profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
        bio: "Mathematics major focusing on applied mathematics and statistics.",
        listings: ["2"],
        savedItems: ["1", "4", "6", "10"]
    },
    {
        _id: "user3",
        name: "Alex Johnson",
        email: "alex@example.com",
        college: "Harvard",
        department: "Chemistry",
        year: 4,
        profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
        bio: "Chemistry major with a minor in Biology. Interested in organic chemistry.",
        listings: ["3"],
        savedItems: ["1", "7", "8"]
    },
    {
        _id: "user4",
        name: "Sarah Williams",
        email: "sarah@example.com",
        college: "Yale",
        department: "Biology",
        year: 3,
        profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
        bio: "Biology major with a focus on molecular biology and genetics.",
        listings: ["4"],
        savedItems: ["6", "9"]
    },
    {
        _id: "user5",
        name: "Michael Brown",
        email: "michael@example.com",
        college: "UC Berkeley",
        department: "Engineering",
        year: 2,
        profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
        bio: "Engineering major specializing in mechanical engineering.",
        listings: ["5"],
        savedItems: ["6", "8"]
    }
];

// Function to get products by category
export const getProductsByCategory = (category) => {
    return dummyProducts.filter(product => product.category === category);
};

// Function to get products by seller
export const getProductsBySeller = (sellerId) => {
    return dummyProducts.filter(product => product.seller._id === sellerId);
};

// Function to get saved products for a user
export const getSavedProducts = (userId) => {
    return dummyProducts.filter(product => product.savedBy.includes(userId));
};

// Function to get user profile
export const getUserProfile = (userId) => {
    return dummyUsers.find(user => user._id === userId);
}; 