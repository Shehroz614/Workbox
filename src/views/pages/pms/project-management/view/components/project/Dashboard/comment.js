import React, { useEffect, useState } from "react";
import { getTimeToDisplay } from "../../../../../../../../utility/Utils";
import avatarBlank from "../../../../../../../../assets/images/avatars/avatar-blank.png";
import {
  Edit2,
  Heart,
  Meh,
  Save,
  Smile,
  ThumbsDown,
  ThumbsUp,
} from "react-feather";
import { ProjectService } from "../../../../../../../../API/services/pmsService";
import { useSweetAlert } from "../../../../../../../components/custom_components/SweetAlert";
import CustomButton from "../../../../../../../components/custom_components/CustomButton";
import { Spinner } from "reactstrap";
import { Switch } from "@mui/material";

const Comment = ({ project }) => {
  const { SweetAlert, SweetAlertWithConfirmation, SweetAlertWithValidation } =
    useSweetAlert();
  const token = localStorage.getItem("token");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    text: "",
    tag: "",
  });
  const [reactions, setReactions] = useState({});
  const [showReactionDiv, setShowReactionDiv] = useState();
  const [showTagField, setShowTagField] = useState(false);

  const handleAddComment = () => {
    if (newComment.text.trim() !== "") {
      createComment({
        projectId: project?.id,
        text: newComment.text,
        tag: newComment.tag,
      });
      // setComments([
      //   ...comments,
      //   {
      //     id: Date.now(),
      //     time: Date.now(),
      //     text: newComment,
      //     user: {
      //       name: "Your Name",
      //       avatar: "url-to-your-avatar-image",
      //     },
      //     reactions: 0,
      //     isEditing: false,
      //   },
      // ]);
      // setNewComment("");
    }
  };

  const handleDeleteComment = (commentId) => {
    // SweetAlertWithConfirmation(
    //   "Are you sure",
    //   () => {deleteComment({ id: commentId })}
    // );
    const updatedComments = comments.filter(
      (comment) => comment.commentId !== commentId
    );
    setComments(updatedComments);
  };

  const handleEditComment = (commentId) => {
    const updatedComments = comments.map((comment) => {
      if (comment.commentId === commentId) {
        return {
          ...comment,
          isEditing: true,
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const handleEditCommentChange = (commentId, editedText) => {
    const updatedComments = comments.map((comment) => {
      if (comment.commentId === commentId) {
        return {
          ...comment,
          text: editedText,
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const handleSaveComment = (commentId, editedText) => {
    editComment({
      id: commentId,
      text: editedText,
      projectId: project?.id,
    });
    // const updatedComments = comments.map((comment) => {
    //   if (comment.commentId === commentId) {
    //     return {
    //       ...comment,
    //       text: editedText,
    //       isEditing: false,
    //     };
    //   }
    //   return comment;
    // });
    // setComments(updatedComments);
  };

  const handleAddReaction = (commentId, reactionType, commentReactionId) => {
    setReactions((prevReactions) => ({
      ...prevReactions,
      [commentId]: reactionType,
    }));
    setShowReactionDiv({ show: false });
    const commentsTemp = comments.map((c) => {
      if (c.commentId == commentId) {
        return {
          ...c,
          commentReactions: [...c.commentReactions, { commentReactionId }],
        };
      } else return c;
    });
    setComments(commentsTemp);

    // Send the reaction to the server
    addReaction({
      commentId,
      commentReactionId,
    });
  };

  const handleRemoveReaction = (commentId, reactionId) => {
    setReactions((prevReactions) => {
      const newReactions = { ...prevReactions };
      delete newReactions[commentId];
      return newReactions;
    });
    setShowReactionDiv({ show: false });
    const commentsTemp = comments.map((c) => {
      if (c.commentId == commentId) {
        return {
          ...c,
          commentReactions: c.commentReactions.slice(1),
        };
      } else return c;
    });
    setComments(commentsTemp);
    deleteReaction({ id: reactionId });
  };

  const {
    data: commentsData,
    isFetching: isLoading,
    refetch: refetchComments,
  } = ProjectService.getComments(["comments"], project?.id, {
    onSuccess: (data) => {
      // console.log(data);
      if (data?.data?.isSuccess) {
        setComments(data?.data?.result?.items);
      } else {
        const errs = data?.data?.result;

        if (errs && Object.keys(errs)?.length > 0) {
          SweetAlertWithValidation(errs);
        } else {
          SweetAlert("error", data.data.message);
        }
      }
    },
    onError: (error) => {
      const errs = error?.response?.data?.result?.referenceErrorCode
        ? null
        : error?.response?.data?.result;

      if (errs && Object.keys(errs)?.length > 0) {
        SweetAlertWithValidation(errs);
      } else {
        SweetAlert(
          "error",
          error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.message
        );
      }
    },
    networkMode: "always",
    enabled: !!token && !!project?.id,
  });

  const { mutate: createComment, isLoading: creatingComment } =
    ProjectService.createComment({
      onSuccess: (response) => {
        if (response.data.isSuccess == true) {
          setNewComment({ text: "", tag: "" });
          refetchComments();
        } else {
          SweetAlert("error", "Unable to create Comment");
        }
      },
      onError: (error) => {
        const errs = error?.response?.data?.result?.referenceErrorCode
          ? null
          : error?.response?.data?.result;

        if (errs && Object.keys(errs)?.length > 0) {
          SweetAlertWithValidation(errs);
        } else {
          SweetAlert(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.title ||
              error?.message
          );
        }
        setCurrentDeleteID(null);
      },
    });

  const { mutate: editComment, isLoading: editingComment } =
    ProjectService.updateComment({
      onSuccess: (response) => {
        if (response.data.isSuccess == true) {
          setNewComment("");
          refetchComments();
        } else {
          SweetAlert("error", "Unable to edit Comment");
        }
      },
      onError: (error) => {
        const errs = error?.response?.data?.result?.referenceErrorCode
          ? null
          : error?.response?.data?.result;

        if (errs && Object.keys(errs)?.length > 0) {
          SweetAlertWithValidation(errs);
        } else {
          SweetAlert(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.title ||
              error?.message
          );
        }
        setCurrentDeleteID(null);
      },
    });

  const { mutate: deleteComment, isLoading: deletingComment } =
    ProjectService.updateComment({
      onSuccess: (response) => {
        if (response.data.isSuccess == true) {
          refetchComments();
        } else {
          SweetAlert("error", "Unable to create Comment");
        }
      },
      onError: (error) => {
        const errs = error?.response?.data?.result?.referenceErrorCode
          ? null
          : error?.response?.data?.result;

        if (errs && Object.keys(errs)?.length > 0) {
          SweetAlertWithValidation(errs);
        } else {
          SweetAlert(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.title ||
              error?.message
          );
        }
        setCurrentDeleteID(null);
      },
    });

  const { mutate: addReaction, isLoading: addingReaction } =
    ProjectService.createCommentReaction({
      onSuccess: (response) => {
        if (response.data.isSuccess == true) {
          // console.log(response);
        } else {
          SweetAlert("error", "Unable to create reaction");
        }
      },
      onError: (error) => {
        const errs = error?.response?.data?.result?.referenceErrorCode
          ? null
          : error?.response?.data?.result;

        if (errs && Object.keys(errs)?.length > 0) {
          SweetAlertWithValidation(errs);
        } else {
          SweetAlert(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.title ||
              error?.message
          );
        }
        setCurrentDeleteID(null);
      },
    });

  const { mutate: deleteReaction, isLoading: deletingReaction } =
    ProjectService.deleteCommentReaction({
      onSuccess: (response) => {
        if (response.data.isSuccess == true) {
          // console.log(response);
        } else {
          SweetAlert("error", "Unable to create reaction");
        }
      },
      onError: (error) => {
        const errs = error?.response?.data?.result?.referenceErrorCode
          ? null
          : error?.response?.data?.result;

        if (errs && Object.keys(errs)?.length > 0) {
          SweetAlertWithValidation(errs);
        } else {
          SweetAlert(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.title ||
              error?.message
          );
        }
        setCurrentDeleteID(null);
      },
    });

  return (
    <div className="comment-app">
      <div className="d-flex headingDiv">
        <h4>Comments</h4>
        <div>
          Add Tag
        <Switch
          id="showTagField-switch"
          name="showTagField"
          checked={showTagField}
          onChange={(e) => {setShowTagField(e.target.checked)}}
        />
        </div>
      </div>
      <div className="d-flex flex-column gap-1">
        <textarea
          rows="4"
          placeholder="Add a comment..."
          value={newComment.text}
          onChange={(e) =>
            setNewComment({ ...newComment, text: e.target.value })
          }
        />
        {showTagField && <input
          type="text"
          className="w-50"
          placeholder="Add a tag..."
          value={newComment?.tag}
          name="tag"
          onChange={(e) =>
            setNewComment({ ...newComment, tag: e.target.value })
          }
        />}
        <CustomButton
          loading={creatingComment}
          color="primary"
          onClick={handleAddComment}
          className="addComment"
        >
          Add Comment
        </CustomButton>
      </div>
      <div className="comment-list">
        {isLoading ? (
          <Spinner />
        ) : (
          comments?.map((comment) => (
            <div className="comment" key={comment.commentId}>
              <div className="comment-header">
                <img
                  style={{
                    width: "50px",
                    borderRadius: "50%",
                    margin: "0 10px",
                  }}
                  src={avatarBlank}
                  alt="user Image"
                  className="user-avatar"
                />
                <span className="user-name" style={{ fontWeight: "600" }}>
                  John Doe
                </span>
              </div>
              <div className="comment-text">
                {comment.isEditing ? (
                  <textarea
                    value={comment.text}
                    className="commentEditTextArea"
                    onChange={(e) =>
                      handleEditCommentChange(comment.commentId, e.target.value)
                    }
                  />
                ) : (
                  <p>{comment.text}</p>
                )}
                {comment.isEditing ? (
                  !editingComment ? (
                    <Save
                      className="mx-1"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleSaveComment(comment.commentId, comment.text)
                      }
                    />
                  ) : (
                    <Spinner
                      className="mx-1"
                      style={{
                        cursor: "pointer",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  )
                ) : (
                  <Edit2
                    size={14}
                    className="mx-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditComment(comment.commentId)}
                  />
                )}
              </div>
              <div
                className="comment-actions d-flex gap-1"
                style={{ marginLeft: "auto" }}
              >
                <span className="comment-time">
                  {getTimeToDisplay(Date.now())}
                </span>
                <div
                  style={{ minWidth: "70px" }}
                  onMouseEnter={() =>
                    setShowReactionDiv({
                      show: true,
                      id: comment.commentId,
                    })
                  }
                  onMouseLeave={() =>
                    setShowReactionDiv({
                      show: false,
                    })
                  }
                >
                  {Object.keys(reactions).includes(
                    String(comment.commentId)
                  ) ? (
                    <button
                      className="reaction-icon like"
                      onClick={() => handleRemoveReaction(comment.commentId)}
                    >
                      {reactions[comment.commentId] === "thumbsUp" ? (
                        <ThumbsUp />
                      ) : reactions[comment.commentId] === "smile" ? (
                        <Smile />
                      ) : reactions[comment.commentId] === "heart" ? (
                        <Heart />
                      ) : reactions[comment.commentId] === "thumbsDown" ? (
                        <ThumbsDown />
                      ) : reactions[comment.commentId] === "surprize" ? (
                        <Meh />
                      ) : (
                        <Meh />
                      )}
                    </button>
                  ) : (
                    <>
                      {showReactionDiv?.show &&
                        showReactionDiv?.id === comment?.commentId && (
                          <div className="reaction-icons">
                            <button
                              className="reaction-icon"
                              onClick={() =>
                                handleAddReaction(
                                  comment.commentId,
                                  "thumbsUp",
                                  1
                                )
                              }
                            >
                              <ThumbsUp />
                            </button>
                            <button
                              className="reaction-icon"
                              onClick={() =>
                                handleAddReaction(comment.commentId, "smile", 2)
                              }
                            >
                              <Smile />
                            </button>
                            <button
                              className="reaction-icon"
                              onClick={() =>
                                handleAddReaction(comment.commentId, "heart", 3)
                              }
                            >
                              <Heart />
                            </button>
                            <button
                              className="reaction-icon"
                              onClick={() =>
                                handleAddReaction(
                                  comment.commentId,
                                  "thumbsDown",
                                  4
                                )
                              }
                            >
                              <ThumbsDown />
                            </button>
                            <button
                              className="reaction-icon"
                              onClick={() =>
                                handleAddReaction(
                                  comment.commentId,
                                  "surprize",
                                  5
                                )
                              }
                            >
                              <Meh />
                            </button>
                          </div>
                        )}
                      <button
                        className="like"
                        style={{ color: "gray", cursor: "pointer" }}
                        // onClick={() =>
                        //   setShowReactionDiv({
                        //     show: !showReactionDiv?.show,
                        //     id: comment.commentId,
                        //   })}
                      >
                        <ThumbsUp />
                      </button>
                    </>
                  )}
                  <span className="my-auto" style={{ textDecoration: "none" }}>
                    ({comment.commentReactions.length || 0})
                  </span>
                </div>
                <button
                  className="delete"
                  onClick={() => handleDeleteComment(comment.commentId)}
                >
                  x
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comment;
