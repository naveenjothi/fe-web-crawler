<template>
  <div class="d-flex flex-column w-100 justify-content-between h-100 my-2">
    <div :class="wrapperClasses">
      <InputComponent
        v-model="data.companyName"
        label="Company Name"
        id="companyName"
        wrapper-class="w-50"
      />
      <InputComponent
        v-model="data.roC"
        label="roC"
        id="roC"
        wrapper-class="w-50"
      />
    </div>
    <div :class="wrapperClasses">
      <InputComponent
        v-model="data.cin"
        label="CIN"
        wrapper-class="w-50"
        id="cin"
        :disabled="componentType == 'edit'"
      />
      <InputComponent
        label="Company Class"
        id="companyClass"
        wrapper-class="w-50"
        v-model="data.companyClass"
      />
    </div>
    <div :class="wrapperClasses">
      <InputComponent
        v-model="data.category"
        label="Category"
        wrapper-class="w-50"
        id="category"
      />
      <InputComponent
        label="Sub Category"
        id="subCategory"
        wrapper-class="w-50"
        v-model="data.subCategory"
      />
    </div>
    <div :class="wrapperClasses">
      <InputComponent
        v-model="data.companyStatus"
        label="Company Status"
        id="companyStatus"
        wrapper-class="w-50"
      />
      <InputComponent
        v-model="data.companyActivity"
        label="Company Activity"
        id="companyActivity"
        wrapper-class="w-50"
      />
    </div>
    <div :class="wrapperClasses">
      <DatePickerComponent
        v-model="data.registrationDate"
        label="Registration Date"
        class="w-100"
        placeholder="Registration Date"
      />
    </div>
    <div :class="wrapperClasses">
      <InputComponent
        label="Address"
        wrapper-class="w-75"
        id="address"
        v-model="data.address"
      />
      <InputComponent
        label="Pincode"
        id="pincode"
        type="number"
        wrapper-class="w-25"
        v-model="data.pinCode"
      />
    </div>
    <div :class="wrapperClasses">
      <InputComponent
        label="State"
        wrapper-class="w-50"
        id="state"
        v-model="data.state"
      />
      <InputComponent
        label="Country"
        id="country"
        wrapper-class="w-50"
        v-model="data.country"
      />
    </div>
    <div :class="wrapperClasses">
      <InputComponent
        label="Managed By"
        id="email"
        v-model="data.email"
        wrapper-class="w-100"
      />
    </div>
    <div :class="wrapperClasses">
      <InputComponent
        label="Authorized Capital"
        wrapper-class="w-50"
        type="number"
        id="authorisedCapital"
        v-model="data.authorisedCapital"
      />
      <InputComponent
        label="Paidup Capital"
        id="paidUpCapital"
        type="number"
        wrapper-class="w-50"
        v-model="data.paidUpCapital"
      />
    </div>
    <div :class="[...wrapperClasses, 'justify-content-end']">
      <ButtonComponent class="w-25 rounded" @click.prevent="handleSave"
        >Save</ButtonComponent
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, toRefs, PropType, computed } from "vue";
import { IClient } from "../../models/client.model";
import InputComponent from "../InputComponent.vue";
import ButtonComponent from "../ButtonComponent.vue";
import axios from "axios";
import { useRoute } from "vue-router";

import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import DatePickerComponent from "../DatePickerComponent.vue";

const emit = defineEmits(["on-success"]);
const route = useRoute();

const props = defineProps({
  data: {
    type: Object as PropType<IClient>,
    default: () => ({
      companyName: "",
      cin: "",
      companyClass: "",
      category: "",
      subCategory: "",
      address: "",
      state: "",
      country: "",
      email: "",
      authorisedCapital: 0,
      paidUpCapital: 0,
      roC: "",
      companyStatus: "",
      companyActivity: "",
      registrationDate: "",
      pinCode: "",
    }),
  },
  componentType: {
    type: String,
    required: true,
    default: "add",
  },
});

const { data, componentType } = toRefs(props);

const rules = computed(() => {
  return {
    companyName: { required },
    cin: { required },
    companyClass: { required },
  };
});

const wrapperClasses = computed(() => [
  props.componentType === "create" ? "w-100" : "w-50",
  "d-flex gap-2",
]);

const v$ = useVuelidate(rules, data);

const handleSave = async () => {
  console.log(v$, "## v dollar");
  try {
    const payload = { ...data.value };
    if (componentType.value === "edit") {
      const itemId = route.params.id as string;
      await axios.post(`/api/clients/${itemId}`, { input: payload });
    } else {
      await axios.post(`/api/clients/`, { input: payload });
    }
    emit("on-success");
  } catch (error) {
    console.error("Save failed:", error);
  }
};
</script>
