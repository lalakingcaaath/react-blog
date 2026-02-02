import Navbar from "../components/Navbar"

export default function Home () {
    return (
        <div className="bg-white min-h-screen max-w-full">
            <Navbar />
            <h2>Welcome to Jecho's Blog!</h2>
            <p>This is the home page.</p>
        </div>
    )
}