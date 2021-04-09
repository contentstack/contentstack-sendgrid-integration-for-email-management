let extensionField;
const senders = [];

const calculateHeight = () => {
  const { body } = document;
  const html = document.documentElement;

  const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  extensionField.window.updateHeight(height);
};

class SendGrid {
  getData() {
    let statusCode;
    return new Promise((resolve, reject) => {
      fetch(`${extensionField.config.baseUrl}v3/verified_senders`, {
        method: 'get',
        headers: {
          Authorization: `${extensionField.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          statusCode = response.status;
          return response.json();
        })
        .then((response) => {
          if (statusCode === 200) return resolve(response);
          throw Error('Failed to fetch resource');
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

const domChangeListener = (data) => {
  let fieldValue;
  $('#select-tools').on('change', () => {
    fieldValue = $('#select-tools').val();
    const fieldValues = [];
    const selectedVal = [];
    if (fieldValues != null) {
      selectedVal.push(fieldValue);
      selectedVal.forEach((value) => {
        data.forEach((element) => {
          if (value === element.name) {
            fieldValues.push(element);
          }
        });
      });
    }

    return extensionField.field.setData(fieldValues);
  });

  $('.selectize-control').on('click', () => {
    calculateHeight();
  });
};

const calculateDomHeight = () => {
  const elHeight = $('.selectize-control').outerHeight() + $('.selectize-dropdown ').height();
  extensionField.window.updateHeight(elHeight);
};

const render = (data) => {
  //  to get previously selected
  const fieldData = extensionField.field.getData();
  const selectedValues = [];

  if (Object.keys(fieldData).length !== 0) {
    fieldData.forEach((element) => {
      selectedValues.push(element.name);
    });
  }
  $('#select-tools').selectize({
    plugins: ['remove_button'],
    maxItems: '1',
    valueField: 'name',
    labelField: 'name',
    searchField: 'name',
    options: data,
    create: false,
    items: selectedValues,
    hideSelected: true,
    render: {
      item(item, escape) {
        return `<div class="item">${item.email}<a href="javascript:void(0)" class="remove" tabindex="-1" title="Remove">×</a></div>`;
      },
      option(item, escape) {
        return `<div class="option">${item.email}</div>`;
      },
    },
    onFocus: () => {
      calculateHeight();
      $('#select-tools-selectized').attr('placeholder', 'Start typing to search');
    },
    onBlur: () => {
      if ($('.option').length === 0) {
        $('#select-tools-selectized').attr('placeholder', ' ');
      } else {
        $('#select-tools-selectized').attr('placeholder', 'Click to select options');
      }
      const elHeight = $('.selectize-control').outerHeight();
      extensionField.window.updateHeight(elHeight);
    },
    onInitialize: () => {
      if (selectedValues.length === 0) {
        $('#select-tools-selectized').attr('placeholder', 'Click to select options');
      } else if (selectedValues.length === senders.length) {
        $('#select-tools-selectized').attr('placeholder', ' ');
      } else {
        $('#select-tools-selectized').attr('placeholder', 'Click to select options');
      }
      const elHeight = $('.selectize-control').outerHeight();
      extensionField.window.updateHeight(elHeight);
    },
    onDropdownOpen: () => {
      calculateDomHeight();
    },
    onItemAdd: () => {
      if ($('.option').length === 0) {
        $('#select-tools-selectized').attr('placeholder', ' ');
      } else {
        $('#select-tools-selectized').attr('placeholder', 'Start typing to search');
      }
    },
    onItemRemove: () => {
      $('#select-tools-selectized').attr('placeholder', 'Start typing to search');
      calculateDomHeight();
    },
  });
  domChangeListener(data);
};

// Contentstack UI Initialize
$(document).ready(() => {
  ContentstackUIExtension.init().then((extension) => {
    extensionField = extension;
    const sendGrid = new SendGrid(extension.config);
    sendGrid.getData().then((response) => {
      const result = [];
      response.results.map((index) => {
        result.push({
          id: index.id,
          email: index.from_email,
          name: index.from_name,
          nickname: index.nickname,
        });
      });
      render(result);
    });
  });
});
