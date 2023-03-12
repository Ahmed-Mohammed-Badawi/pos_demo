import Image from "next/image";
import React from "react";
import classes from "./DeleteBox.module.scss";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { cancel_delete } from "@/Redux/Reducers/Delete_all__Reducer";
import {
    deleteUser,
    deleteBranch,
    deleteCategory,
    deleteItem,
    deletePayment,
    deleteUnit,
} from "@/Redux/Actions/delete";
import { removeById } from "@/Redux/Reducers/TablesReducer";
//Notifications
import { toast } from "react-toastify";

function DeleteBox() {

    // Redux
    const dispatch = useDispatch();
    const {
        deleteBox,
        deleteBoxData: { heading, content },
        deleteType,
        user: { id: userId },
        category: { id: categoryId },
        item: { id: itemId },
        unit: { id: unitId },
        branch: { id: branchId },
        payment: { id: paymentId },
    } = useSelector((state) => state.deleteAll);

    return (
        <article
            className={[classes.DeleteBox, deleteBox ? classes.Show : ""].join(
                " "
            )}
        >
            <div
                className={classes.DeleteBox__Icon}
                onClick={() => dispatch(cancel_delete())}
            >
                <Image
                    src={"/Icons/close.svg"}
                    width={20}
                    height={20}
                    alt={"close"}
                />
            </div>
            <div className={classes.DeleteBox__Content}>
                <h2 className={classes.DeleteBox__Title}>{heading}</h2>
                <p className={classes.DeleteBox__Text}>{content}</p>
            </div>
            <div className={classes.DeleteBox__Buttons}>
                <button
                    onClick={() => dispatch(cancel_delete())}
                    className={classes.DeleteBox__Cancel}
                >
                    الغاء
                </button>
                <button
                    onClick={async () => {
                        if (deleteType === "user" && userId) {
                            await dispatch(deleteUser(userId));
                            dispatch(
                                removeById({
                                    section: "users",
                                    id: userId,
                                })
                            );
                        } else if (deleteType === "category" && categoryId) {
                            await dispatch(deleteCategory(categoryId));
                            dispatch(
                                removeById({
                                    section: "categories",
                                    id: categoryId,
                                })
                            );
                        } else if (deleteType === "item" && itemId) {
                            await dispatch(deleteItem(itemId));
                            dispatch(
                                removeById({
                                    section: "items",
                                    id: itemId,
                                })
                            );
                        } else if (deleteType === "unit" && unitId) {
                            dispatch(deleteUnit(unitId));
                            dispatch(
                                removeById({
                                    section: "units",
                                    id: unitId,
                                })
                            );
                        } else if (deleteType === "branch" && branchId) {
                            dispatch(deleteBranch(branchId));
                            dispatch(
                                removeById({
                                    section: "branches",
                                    id: branchId,
                                })
                            );
                        } else if (deleteType === "payment" && paymentId) {
                            dispatch(deletePayment(paymentId));
                            dispatch(
                                removeById({
                                    section: "payments",
                                    id: paymentId,
                                })
                            );
                        } else {
                            toast.warning(
                                "The Deleted Item (Category || ID) is not defiend"
                            );
                            dispatch(cancel_delete());
                        }
                    }}
                    className={classes.DeleteBox__Delete}
                >
                    حذف
                </button>
            </div>
        </article>
    );
}

export default DeleteBox;
