//Redux
import {createSlice} from "@reduxjs/toolkit";

const HomeSlice = createSlice({
    name: "home",
    initialState: {
        ActiveCategory: null,
        ActiveCategoryId: null,
        Items: [],
        ItemsPreview: [],
        InputsData: {
            TaxAmount: 0,
            Delivery: 0,
            Sale: 0,
            PhoneNumber: null,
            ClientId: '',
            ClientName: null,
            ClientAddress: null,
            insideTheResturant: false,
            clientArea: {
                label: null,
                id: null
            },
            paymentMethod: {
                label: null,
                id: null
            },
        },
        total: 0,
    },
    reducers: {
        AddItem: (state, action) => {
            // Search for the item by name
            const theItem = state.Items.find(
                (item) => item.name === action.payload.name
            );
            // if the item is not found create a new item
            if (!theItem) {
                const newItem = {
                    itemId: action.payload.id,
                    name: action.payload.name,
                    quantity: action.payload.unitValue,
                    price: action.payload.price,
                    category: action.payload.category,
                    total: action.payload.price * action.payload.unitValue,
                    unit: {
                        unitId: action.payload.unitId,
                        unitValue: action.payload.unitValue,
                    },
                };
                // Push the new item to the state store items
                state.Items.push(newItem);
            } else {
                // get the index of the item
                const itemIndex = state.Items.indexOf(theItem);
                // Add 1 to the item quantity
                const newItem = {
                    ...theItem,
                    quantity: theItem.quantity + theItem.unit.unitValue,
                    total:
                        +theItem.total +
                        parseFloat(action.payload.price) *
                        parseFloat(theItem.unit.unitValue),
                };
                // Set the item to the new item
                state.Items[itemIndex] = newItem;
            }
        },
        DeleteItem: (state, action) => {
            // Make an inestance of the Array of items to delete
            const itemsToDelete = state.Items;
            // Search for the item by name
            const theItem = state.Items.find(
                (item) => item.name === action.payload.name
            );
            // get the index of the item
            const itemIndex = state.Items.indexOf(theItem);

            // Delete the item
            itemsToDelete.splice(itemIndex, 1);

            // Set the state with the items
            state.Items = itemsToDelete;
        },
        QuantityPlus: (state, action) => {
            // Search for the item by name
            const theItem = state.Items.find(
                (item) => item.name === action.payload.name
            );
            // get the index of the item
            const itemIndex = state.Items.indexOf(theItem);

            // Add 1 to the item quantity
            const newItem = {
                ...theItem,
                quantity: theItem.quantity + +theItem.unit.unitValue,
                total:
                    (+action.payload.quantity + theItem.unit.unitValue) *
                    +action.payload.price,
            };
            // Set the item to the new item
            state.Items[itemIndex] = newItem;
        },
        QuantitySubtract: (state, action) => {
            // Search for the item by name
            const theItem = state.Items.find(
                (item) => item.name === action.payload.name
            );
            // get the index of the item
            const itemIndex = state.Items.indexOf(theItem);

            // Calculate the new total of item
            let newTotal = 0;
            if (
                action.payload.quantity > 0 &&
                action.payload.quantity > theItem.unit.unitValue
            ) {
                let newQuantity =
                    parseFloat(action.payload.quantity) -
                    parseFloat(theItem.unit.unitValue);
                newTotal =
                    parseFloat(newQuantity) * parseFloat(action.payload.price);
            } else {
                newTotal =
                    parseFloat(theItem.unit.unitValue) *
                    parseFloat(action.payload.price);
            }
            // Add 1 to the item quantity
            const newItem = {
                ...theItem,
                quantity:
                    theItem.quantity > theItem.unit.unitValue
                        ? theItem.quantity - theItem.unit.unitValue
                        : theItem.unit.unitValue,
                total: newTotal,
            };
            // Set the item to the new item
            state.Items[itemIndex] = newItem;
        },
        QuantityChangedManually: (state, action) => {
            // Search for the item by name
            const theItem = state.Items.find(
                (item) => item.name === action.payload.name
            );
            // get the index of the item
            const itemIndex = state.Items.indexOf(theItem);

            // Add 1 to the item quantity
            const newItem = {
                ...theItem,
                quantity: action.payload.quantity,
                total: +action.payload.quantity * +action.payload.price,
            };
            // Set the item to the new item
            state.Items[itemIndex] = newItem;
        },
        changeAreaSelect: (state, action) => {
            state.InputsData.clientArea.label = action.payload.label;
            state.InputsData.clientArea.id = action.payload.id;
        },
        changePaymentMethod: (state, action) => {
            state.InputsData.paymentMethod.label = action.payload.label;
            state.InputsData.paymentMethod.id = action.payload.id;
        },
        setClientInfo: (state, action) => {
            state.InputsData.ClientName = action.payload.name;
            state.InputsData.ClientAddress = action.payload.address;
            state.InputsData.ClientId = action.payload.clientId
        },
        setActiveCategory: (state, action) => {
            state.ActiveCategory = action.payload.category;
            state.ActiveCategoryId = action.payload.categoryId;
        },
        changeInputData: (state, action) => {
            if (state.InputsData[action.payload.inputName]) {
                state.InputsData[action.payload.inputName] =
                    action.payload.inputValue;
            } else {
                state.InputsData = {
                    ...state.InputsData,
                    [action.payload.inputName]: action.payload.inputValue,
                };
            }
        },
        ResetAll: (state, action) => {
            state.Items = [];
            state.InputsData.Delivery = 0;
            state.InputsData.PhoneNumber = null;
            state.InputsData.ClientName = null;
            state.InputsData.ClientAddress = null;
            state.InputsData.paymentMethod.label = null;
            state.InputsData.paymentMethod.id = null;
            state.InputsData.ClientId = '';
            state.total = 0;
            if (action.payload !== 'cashier') {
                state.InputsData.clientArea.label = null;
                state.InputsData.clientArea.id = null;
            }
        },
        setTotal: (state, action) => {
            state.total = action.payload.total;
        },
        setItemsPreview: (state, action) => {
            state.ItemsPreview = action.payload;
        },
    },
});

export const {
    AddItem,
    DeleteItem,
    QuantityPlus,
    QuantitySubtract,
    QuantityChangedManually,
    setActiveCategory,
    ResetAll,
    changeInputData,
    changeAreaSelect,
    changePaymentMethod,
    setTotal,
    setItemsPreview,
    setClientInfo,
} = HomeSlice.actions;

export default HomeSlice;
