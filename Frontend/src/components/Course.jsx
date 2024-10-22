import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import axios from "axios";
import { Link } from "react-router-dom";
import list from "../../public/list.json"; // Your local list

function Course() {
  const [book, setBook] = useState([]); // Initialize with an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBook = async () => {
      setLoading(true); // Start loading
      try {
        const res = await axios.get("http://localhost:4001/book"); // API request
        if (res.status === 200) {
          // Filter the fetched books to show only paid ones
          const paidBooks = res.data.filter(item => item.price > 0);
          setBook(paidBooks.length > 0 ? paidBooks : list.filter(item => item.price > 0)); // Fallback to local list if no paid books from API
        } else {
          setError("Failed to load books from server");
          setBook(list.filter(item => item.price > 0)); // Fallback to local list
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
        // Fallback to local list.json if API request fails
        setBook(list.filter(item => item.price > 0));
        setError("Failed to load books. Please try again later.");
      }
      setLoading(false); // End loading
    };

    getBook(); // Fetch API data
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  return (
    <div className="-w-screen-2xl container mx-auto md:px-20 px-4">
      <div className="mt-16 items-center justify-center text-center">
        <h1 className="text-2xl pt-5 md:text-4xl">
          We're delighted to have you <span className="text-pink-500">Here! :)</span>
        </h1>
        <p className="mt-12">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro, assumenda?
          Repellendus, iste corrupti? Tempore laudantium repellendus accusamus accusantium sed 
          architecto odio, nisi expedita quas quidem nesciunt debitis dolore non aspernatur...
        </p>
        <Link to="/">
          <button className="mt-6 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-700 duration-300">
            Back
          </button>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-4">
        {loading ? (
          <p>Loading books...</p>
        ) : error ? (
          <p>{error}</p>
        ) : book.length > 0 ? (
          book.map((item) => <Cards key={item.id} item={item} />)
        ) : (
          <p>No books available</p>
        )}
      </div>
    </div>
  );
}

export default Course;
