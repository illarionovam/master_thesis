import { createAsyncThunk } from '@reduxjs/toolkit';
import wrapper from '../wrapper.js';
import { uploadImage } from '../../api/helpers.js';

export const uploadImageHelper = createAsyncThunk('helpers/uploadImage', async (fd, { rejectWithValue }) =>
    wrapper(uploadImage, rejectWithValue)(fd)
);
