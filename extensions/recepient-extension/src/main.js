let extensionField;
const recipientList = [];

const calculateHeight = () => {
  const { body } = document;
  const html = document.documentElement;

  const height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight,
  );
  extensionField.window.updateHeight(height);
};

class SendGrid {
  getRecipientList() {
    let statusCode;
    return new Promise((resolve, reject) => {
      fetch(`${extensionField.config.baseUrl}v3/marketing/lists`, {
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
          if (statusCode === 200) {
            return resolve(response);
          }
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
    if (fieldValue !== null) {
      fieldValue.forEach((value) => {
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
  const fieldData = extensionField.field.getData();
  const selectedValues = [];
  if (Object.keys(fieldData).length !== 0) {
    fieldData.forEach((element) => {
      selectedValues.push(element.name);
    });
  }
  $('#select-tools').selectize({
    plugins: ['remove_button'],
    maxItems: null,
    valueField: 'name',
    labelField: 'name',
    searchField: 'name',
    options: data,
    create: false,
    items: selectedValues,
    hideSelected: true,
    render: {
      item(item, escape) {
        return `<div class="item">${item.name}
                  <span class="action edit-entry">
                    <a  href="https://mc.sendgrid.com/contacts/lists/${item.id}" target="_blank">
                      <img src="https://app.contentstack.com/static/images/edit-icon-ref1.svg"></a>
                  </span>
                    <a href="javascript:void(0)" class="remove" tabindex="-1" title="Remove">×</a>  
                </div>`;
      },
      option(item, escape) {
        return `<div class="option">${item.name}</div>`;
      },
    },
    onFocus: () => {
      calculateHeight();
      $('#select-tools-selectized').attr(
        'placeholder',
        'Start typing to search',
      );
    },
    onBlur: () => {
      if ($('.option').length === 0) {
        $('#select-tools-selectized').attr('placeholder', ' ');
      } else {
        $('#select-tools-selectized').attr(
          'placeholder',
          'Click to select options',
        );
      }
      const elHeight = $('.selectize-control').outerHeight();
      extensionField.window.updateHeight(elHeight);
    },
    onInitialize: () => {
      if (selectedValues.length === 0) {
        $('#select-tools-selectized').attr(
          'placeholder',
          'Click to select options',
        );
      } else if (selectedValues.length === recipientList.length) {
        $('#select-tools-selectized').attr('placeholder', ' ');
      } else {
        $('#select-tools-selectized').attr(
          'placeholder',
          'Click to select options',
        );
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
        $('#select-tools-selectized').attr(
          'placeholder',
          'Start typing to search',
        );
      }
    },
    onItemRemove: () => {
      $('#select-tools-selectized').attr(
        'placeholder',
        'Start typing to search',
      );
      calculateDomHeight();
    },
  });
  domChangeListener(data);
};

// Contentstack UI Initialize
$(document).ready(() => {
  ContentstackUIExtension.init().then((extension) => {
    extensionField = extension;
    const sendGrid = new SendGrid(extension.config); // initialize request object using config
    sendGrid.getRecipientList().then((response) => {
      render(response.result);
    });
  });
});
