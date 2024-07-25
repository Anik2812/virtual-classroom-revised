import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const ClassDetails = () => {
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { classId } = useParams();

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await api.get(`/classes/${classId}`);
        setClassDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching class details:', err);
        setError('Failed to load class details. Please try again.');
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!classDetails) return <div>No class details found.</div>;

  return (
    <div>
      <h2>{classDetails.name}</h2>
      <p>{classDetails.description}</p>
      <h3>Assignments</h3>
      {classDetails.assignments && classDetails.assignments.length > 0 ? (
        <ul>
          {classDetails.assignments.map((assignment) => (
            <li key={assignment._id}>{assignment.title}</li>
          ))}
        </ul>
      ) : (
        <p>No assignments for this class yet.</p>
      )}
    </div>
  );
};

export default ClassDetails;