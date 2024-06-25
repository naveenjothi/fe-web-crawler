<template>
  <div class="d-flex flex-column w-100 justify-content-between h-100 my-2">
    <div class="w-50">
      <InputComponent
        v-model="data.companyName"
        label="Company Name"
        id="companyName"
      />
      <InputComponent v-model="data.roC" label="roC" id="roC" />
    </div>
    <div class="w-50">
      <InputComponent
        v-model="data.companyStatus"
        label="Company Status"
        id="companyStatus"
      />
      <InputComponent
        v-model="data.companyActivity"
        label="Company Activity"
        id="companyActivity"
      />
    </div>
    <div class="w-50">
      <InputComponent
        v-model="data.registrationDate"
        label="Registration Date"
        id="registrationDate"
      />
    </div>
    <div class="w-50 d-flex gap-2">
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
    <div class="w-50 d-flex gap-2">
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
    <div class="w-50 d-flex gap-2">
      <InputComponent label="Address" id="address" v-model="data.address" />
      <InputComponent
        label="Pincode"
        id="pincode"
        type="number"
        wrapper-class="w-50"
        v-model="data.pinCode"
      />
    </div>
    <div class="w-50 d-flex gap-2">
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
    <div class="w-50">
      <InputComponent label="Managed By" id="email" v-model="data.email" />
    </div>
    <div class="w-50 d-flex gap-2">
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
    <div class="w-50 d-flex justify-content-end">
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
