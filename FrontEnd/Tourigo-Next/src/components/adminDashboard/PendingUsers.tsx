import { useEffect, useState } from "react";
import { IPendingUser } from "@/interFace/interFace";
import { fetchPendingUsers, approvePendingUserById, deletePendingUserById } from "@/api/adminApi";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { imageLoader } from "@/hooks/image-loader";

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState<IPendingUser[]>([]);
  const [buttonStates, setButtonStates] = useState<{ [key: string]: "accepted" | "rejected" | "none" }>({});
  const [documentViewed, setDocumentViewed] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPendingUsers();
        setPendingUsers(data);
      } catch (error) {
        console.error("Failed to load pending users:", error);
      }
    };
    fetchData();
  }, []);

  const handleViewDocument = (id: string) => {
    setDocumentViewed((prev) => ({ ...prev, [id]: true }));  // Mark document as viewed for this user
  };

  const handleAccept = async (id: string) => {
    const confirmAccept = window.confirm("Are you sure you want to approve this user?");
    if (!confirmAccept) return;

    try {
      await approvePendingUserById(id);
      setPendingUsers((prev) => prev.filter((user) => user._id !== id));
      setButtonStates((prev) => ({ ...prev, [id]: "accepted" }));
      alert("User has been approved successfully.");
    } catch (error) {
      console.error(`Error approving user with ID ${id}:`, error);
    }
  };

  const handleReject = async (id: string) => {
    const confirmReject = window.confirm("Are you sure you want to reject this user?");
    if (!confirmReject) return;

    try {
      await deletePendingUserById(id);
      setPendingUsers((prev) => prev.filter((user) => user._id !== id));
      setButtonStates((prev) => ({ ...prev, [id]: "rejected" }));
      alert("User has been rejected successfully.");
    } catch (error) {
      console.error(`Error rejecting user with ID ${id}:`, error);
    }
  };

  return (
    <section className="bd-recent-activity section-space-small-bottom">
      <div className="container" style={{ paddingTop: "40px" }}>
        <div className="row">
          <div className="col-xxl-12">
            <div className="recent-activity-wrapper">
              <div className="section-title-wrapper section-title-space">
                <h2 className="section-title">Pending Users</h2>
              </div>
              <div className="recent-activity-content">
                <div className="table-responsive" style={{ maxHeight: "373px", overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#006CE4 #F2F2F2" }}>
                  <table className="table mb-0">
                    <tbody>
                      {pendingUsers.map((booking) => (
                        <tr key={booking._id} className="table-custom">
                          <td>
                            <div className="dashboard-thumb-wrapper p-relative">
                              <div className="dashboard-thumb image-hover-effect-two position-relative">
                                <Image src="/images/default-image.jpg" loader={imageLoader} style={{ width: "100%", height: "auto" }} alt="image" />
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="recent-activity-title-box d-flex align-items-center gap-10">
                              <div>
                                <h5 className="tour-title fw-5 underline">
                                  <Link href={`/details/${booking._id}`}>{booking.role}</Link>
                                </h5>
                                <div className="recent-activity-location">Email: {booking.email}</div>
                                <p className="">Username: {booking.username}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <button
                              className="view-document-button"
                              style={{
                                backgroundColor: "#006CE4",
                                color: "white",
                                padding: "8px 16px",
                                fontSize: "14px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                marginBottom: "8px",
                              }}
                              onClick={() => handleViewDocument(booking._id)}
                            >
                              View Document
                            </button>

                            <button
                              onClick={() => handleAccept(booking._id)}
                              disabled={!documentViewed[booking._id]}  // Disable if document not viewed
                              style={{
                                backgroundColor: documentViewed[booking._id]
                                  ? buttonStates[booking._id] === "accepted"
                                    ? "green"
                                    : "lightgray"
                                  : "lightgray",
                                color: buttonStates[booking._id] === "accepted" ? "white" : "black",
                                fontSize: "20px",
                                marginLeft: "40px",
                                cursor: documentViewed[booking._id] ? "pointer" : "not-allowed",
                                padding: "5px",
                                border: "none",
                                borderRadius: "4px",
                                transition: "background-color 0.3s",
                              }}
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>

                            <button
                              onClick={() => handleReject(booking._id)}
                              disabled={!documentViewed[booking._id]}  // Disable if document not viewed
                              style={{
                                backgroundColor: documentViewed[booking._id]
                                  ? buttonStates[booking._id] === "rejected"
                                    ? "red"
                                    : "lightgray"
                                  : "lightgray",
                                color: buttonStates[booking._id] === "rejected" ? "white" : "black",
                                fontSize: "20px",
                                marginLeft: "40px",
                                cursor: documentViewed[booking._id] ? "pointer" : "not-allowed",
                                padding: "5px",
                                border: "none",
                                borderRadius: "4px",
                                transition: "background-color 0.3s",
                              }}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PendingUsers;
